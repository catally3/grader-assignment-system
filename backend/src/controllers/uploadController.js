import path from 'path';
import { ValidationError } from 'sequelize';
import pdfParser from '../utils/pdfParser.js';
import excelParser from '../utils/excelParser.js';
import csvParser from '../utils/csvParser.js';
import db from '../models/index.js';
const { Applicant, Course } = db;

/**
 * Processes an uploaded ZIP file containing individual resume PDFs.
 */
const processResumeZip = async (req, res) => {
  try {
    const zipFilePath    = req.file.path;
    const dataToInsert   = await pdfParser.parseZipResumes(zipFilePath);
    const savedApplicants= await Applicant.bulkCreate(dataToInsert);
    return res.json({ message: 'Saved!', applicants: savedApplicants });
  } catch (err) {
    console.error('BulkCreate failed:', err);

    if (err instanceof ValidationError) {
      // this will list every column that failed validation
      const details = err.errors.map(e => `[${e.path}] ${e.message}`);
      return res.status(400).json({ error: 'Validation error', details });
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

const processCourseFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    let coursesData = [];
    if (ext === '.csv') {
      coursesData = await csvParser.parseCSVFile(filePath);
      coursesData = coursesData.map(row => ({
        professorName: row.professorName,
        courseName: row.courseName,
        criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria
      }));
    } else {
      coursesData = await excelParser.parseCourseFile(filePath);
    }
    const savedCourses = await Course.bulkCreate(coursesData);
    res.json({ message: 'Course file processed and courses saved', courses: savedCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { processCV, processCourseFile, processResumeZip };
