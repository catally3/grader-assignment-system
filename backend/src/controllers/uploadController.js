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
        // rec should have these from mapToApplicant:
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

      // BUILD A WHERE CLAUSE THAT FALLS BACK:
      const where = {};
      if (student_id) {
        where.student_id = student_id;
        where.semester   = semester;
      } else {
        where.document_id = document_id;
      }

      // 1) Look up existing row by student_id+semester OR document_id
      let app = await Applicant.findOne({ where });

      if (app) {
        // 2) Only fill the holes in the existing record
        const updates = {};

        // Excel-loaded fields: only set if missing in DB
        if ((!app.applicant_name || !app.applicant_name.trim()) && newName) {
          updates.applicant_name = newName;
        }
        if ((!app.applicant_email || !app.applicant_email.trim()) && newEmail) {
          updates.applicant_email = newEmail;
        }
        if ((app.gpa == null) && newGpa != null) {
          updates.gpa = newGpa;
        }
        if ((!app.resume_path || !app.resume_path.trim()) && newPath) {
          updates.resume_path = newPath;
        }

        // Always merge arrays (union)
        const mergedSkills = Array.from(new Set([...(app.skills||[]), ...newSkills]));
        const mergedExp    = Array.from(new Set([...(app.experience||[]), ...newExp]));

        if (mergedSkills.length && JSON.stringify(mergedSkills) !== JSON.stringify(app.skills)) {
          updates.skills = mergedSkills;
        }
        if (mergedExp.length && JSON.stringify(mergedExp) !== JSON.stringify(app.experience)) {
          updates.experience = mergedExp;
        }

        // 3) Apply updates if there's anything new
        if (Object.keys(updates).length) {
          await app.update(updates);
        }
      } else {
        // 4) No matching Excel row, create a brand-new record
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
        error: 'Validation error',
        details: err.errors.map(e => `[${e.path}] ${e.message}`)
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Keep your existing processCV and processCourseFile functions here.
const processCV = async (req, res) => {
  try {
    const filePath = req.file.path;
    const applicantsData = await pdfParser.parseResumePdf(filePath);
    const savedApplicants = await Applicant.bulkCreate(applicantsData);
    res.json({ message: 'CV processed and applicants saved', applicants: savedApplicants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// —————————— STEP 1: import + process your candidate Excel ——————————
const processCandidateFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext      = path.extname(filePath).toLowerCase();
    if (!['.xlsx','.xls'].includes(ext)) {
      return res.status(400).json({ error: 'Expected .xlsx or .xls file' });
    }

    // parse and insert candidates
    const candidatesData  = await excelParser.parseCandidateFile(filePath);
    const savedCandidates = await Applicant.bulkCreate(candidatesData);
    return res.json({
      message: 'Candidate list processed and saved',
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

const processCourseFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext      = path.extname(filePath).toLowerCase();

    // 1) Parse the raw rows from CSV or Excel
    let rows = [];
    if (ext === '.csv') {
      const raw = await csvParser.parseCSVFile(filePath);
      rows = raw.map(r => ({
        semester:             r.semester,
        professor_name:       r.professorName,
        professor_email:      r.professorEmail,
        course_number:        r.courseNumber,
        course_section:       r.section,
        course_name:          r.courseName,
        number_of_graders:    parseInt(r.numOfGraders, 10),
        keywords:             Array.isArray(r.criteria)
                                ? r.criteria
                                : JSON.parse(r.criteria || '[]'),
        recommended_student_name: r.recommendedStudentName,
        recommended_student_netid: r.recommendedStudentNetid
      }));
    } else {
      rows = await excelParser.parseCourseFile(filePath);
    }

    // 2) Upsert Course rows (unique on course_number, course_section, semester)
    const courseMap = new Map();
    for (const r of rows) {
      const key = `${r.course_number}||${r.course_section}||${r.semester || 'Semester'}`;
      if (!courseMap.has(key)) {
        courseMap.set(key, {
          semester:          r.semester,
          professor_name:    r.professor_name,
          professor_email:   r.professor_email,
          course_number:     r.course_number,
          course_section:    r.course_section,
          course_name:       r.course_name,
          number_of_graders: r.number_of_graders,
          keywords:          r.keywords
        });
      }
    }
    const courseData = Array.from(courseMap.values());
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

    // 3) Build a lookup from our natural key to the new PK
    const idMap = {};
    for (const c of savedCourses) {
      const key = `${c.course_number}||${c.course_section}||${c.semester}`;
      idMap[key] = c.id;
    }

    // 4) Assemble and upsert Recommendations
    const recs = rows.map(r => ({
      semester:           r.semester,
      professor_id:       idMap[`${r.course_number}||${r.course_section}||${r.semester || 'Semester'}`],
      applicant_name:     r.recommended_student_name,
      applicant_net_id:   r.recommended_student_netid
    }));

    const savedRecs = await Recommendation.bulkCreate(recs, {
      updateOnDuplicate: ['applicant_name', 'applicant_net_id'],
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

export default { processCV, processCandidateFile, processCourseFile, processResumeZip };
