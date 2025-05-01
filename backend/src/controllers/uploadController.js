// controllers/uploadController.js

import path from 'path';
import { ValidationError } from 'sequelize';
import pdfParser from '../utils/pdfParser.js';
import excelParser from '../utils/excelParser.js';
import csvParser from '../utils/csvParser.js';
import db from '../models/index.js';
const { Applicant, Course, Recommendation } = db;

/**
 * Processes an uploaded ZIP file containing individual resume PDFs.
 */
const processResumeZip = async (req, res) => {
  try {
    const dataToInsert = await pdfParser.parseZipResumes(req.file.path);
    const results = [];

    for (const rec of dataToInsert) {
      const {
        student_id,
        document_id,
        semester,
        applicant_name: newName,
        applicant_email: newEmail,
        gpa: newGpa,
        resume_path: newPath,
        skills: newSkills,
        experience: newExp
      } = rec;

      const where = student_id
        ? { student_id, semester }
        : { document_id };

      let app = await Applicant.findOne({ where });

      if (app) {
        const updates = {};
        if ((!app.applicant_name?.trim()) && newName) updates.applicant_name = newName;
        if ((!app.applicant_email?.trim()) && newEmail) updates.applicant_email = newEmail;
        if ((app.gpa == null) && newGpa != null) updates.gpa = newGpa;
        if ((!app.resume_path?.trim()) && newPath) updates.resume_path = newPath;

        const mergedSkills = Array.from(new Set([...(app.skills||[]), ...newSkills]));
        const mergedExp    = Array.from(new Set([...(app.experience||[]), ...newExp]));

        if (mergedSkills.length && JSON.stringify(mergedSkills)!==JSON.stringify(app.skills)) {
          updates.skills = mergedSkills;
        }
        if (mergedExp.length && JSON.stringify(mergedExp)!==JSON.stringify(app.experience)) {
          updates.experience = mergedExp;
        }

        if (Object.keys(updates).length) {
          await app.update(updates);
        }
      } else {
        app = await Applicant.create(rec);
      }

      results.push(app);
    }

    return res.json({
      message: 'Resume ZIP processed; records enriched where needed',
      applicants: results
    });
  } catch (err) {
    console.error('Error in processResumeZip:', err);
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error:   'Validation error',
        details: err.errors.map(e => `[${e.path}] ${e.message}`)
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Processes a single PDF resume.
 */
const processCV = async (req, res) => {
  try {
    const filePath = req.file.path;
    const [raw]    = await pdfParser.parseResumePdf(filePath);
    const details  = pdfParser.extractCandidateDetailsFromFileName(req.file.filename) || {};
    const rec      = pdfParser.mapToApplicant(raw, details, filePath);

    const where = rec.student_id
      ? { student_id: rec.student_id, semester: rec.semester }
      : { document_id: rec.document_id };

    let app = await Applicant.findOne({ where });

    if (app) {
      await app.update({
        resume_path: rec.resume_path,
        skills:      rec.skills,
        experience:  rec.experience
      });
    } else {
      app = await Applicant.create(rec);
    }

    return res.json({
      message: 'CV processed and applicant saved',
      applicant: app
    });
  } catch (err) {
    console.error('Error in processCV:', err);
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error:   'Validation error',
        details: err.errors.map(e => `[${e.path}] ${e.message}`)
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Processes an uploaded Excel file of candidates.
 */
const processCandidateFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext      = path.extname(filePath).toLowerCase();
    if (!['.xlsx', '.xls'].includes(ext)) {
      return res.status(400).json({ error: 'Expected .xlsx or .xls file' });
    }

    const candidatesData = await excelParser.parseCandidateFile(filePath);
    const savedCandidates = await Applicant.bulkCreate(candidatesData, {
      // On duplicate (student_id, semester), update only the Excel‐derived fields:
      updateOnDuplicate: [
        'applicant_name',
        'applicant_email',
        'school_year',
        'university',
        'school',
        'graduation_date',
        'major',
        'qualified',
        'continuing',
        'gpa'
      ],
      returning: true
    });

    return res.json({
      message: 'Candidate list processed and upserted',
      applicants: savedCandidates
    });
  } catch (err) {
    console.error('Error in processCandidateFile:', err);
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error:   'Validation error',
        details: err.errors.map(e => `[${e.path}] ${e.message}`)
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Processes an uploaded course/professor Excel or CSV file.
 */
const processCourseFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext      = path.extname(filePath).toLowerCase();

    // 1) Parse the sheet (or CSV) into one array of row-objects
    let rows = [];
    if (ext === '.csv') {
      const raw = await csvParser.parseCSVFile(filePath);
      rows = raw.map(r => ({
        semester:                  r.semester,
        professor_name:            r.professorName,
        professor_email:           r.professorEmail,
        course_number:             r.courseNumber,
        course_section:            r.section,
        course_name:               r.courseName,
        number_of_graders:         parseInt(r.numOfGraders, 10),
        keywords:                  Array.isArray(r.criteria)
                                    ? r.criteria
                                    : JSON.parse(r.criteria || '[]'),
        recommended_student_name:  r.recommendedStudentName,
        recommended_student_netid: r.recommendedStudentNetid
      }));
    } else {
      rows = await excelParser.parseCourseFile(filePath);
    }

    // 2) Build and upsert Courses (ignore the recommendation fields here)
    const courseData = rows.map(r => ({
      semester:          r.semester,
      professor_name:    r.professor_name,
      professor_email:   r.professor_email,
      course_number:     r.course_number,
      course_section:    r.course_section,
      course_name:       r.course_name,
      number_of_graders: r.number_of_graders,
      keywords:          r.keywords
    }));

    const savedCourses = await Course.bulkCreate(courseData, {
      updateOnDuplicate: [
        'professor_name',
        'professor_email',
        'course_name',
        'number_of_graders',
        'keywords'
      ],
      returning: true
    });

    // 3) Map each course’s natural key → its new PK
    const idMap = {};
    for (const c of savedCourses) {
      const key = `${c.course_number}||${c.course_section}||${c.semester}`;
      idMap[key] = c.id;
    }

    // 4) Assemble and upsert Recommendations
    const recData = rows
      .filter(r => r.recommended_student_name && r.recommended_student_netid)
      .map(r => {
        const key = `${r.course_number}||${r.course_section}||${r.semester}`;
        return {
          semester:         r.semester,
          professor_id:     idMap[key],
          applicant_name:   r.recommended_student_name,
          applicant_net_id: r.recommended_student_netid
        };
      });

    const savedRecs = await Recommendation.bulkCreate(recData, {
      updateOnDuplicate: ['applicant_name','applicant_net_id'],
      returning: true
    });

    return res.json({
      message: 'Courses and recommendations processed',
      courses: savedCourses,
      recommendations: savedRecs
    });

  } catch (err) {
    console.error('Error in processCourseFile:', err);
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error:   'Validation error',
        details: err.errors.map(e => `[${e.path}] ${e.message}`)
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

export default {
  processCV,
  processCandidateFile,
  processCourseFile,
  processResumeZip
};
