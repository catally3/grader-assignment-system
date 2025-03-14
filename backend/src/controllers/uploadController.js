import path from 'path';
import pdfParser from '../utils/pdfParser.js';
import excelParser from '../utils/excelParser.js';
import csvParser from '../utils/csvParser.js';
import db from '../models/index.js';
const { Candidate, Course } = db;

const processCV = async (req, res) => {
  try {
    const filePath = req.file.path;
    // Parse the merged PDF file to extract candidate data.
    const candidatesData = await pdfParser.parseResumePdf(filePath);
    // Save parsed candidates to the database.
    const savedCandidates = await Candidate.bulkCreate(candidatesData);
    res.json({ message: 'CV processed and candidates saved', candidates: savedCandidates });
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
      // Use CSV parser for CSV files.
      coursesData = await csvParser.parseCSVFile(filePath);
      coursesData = coursesData.map(row => ({
        professorName: row.professorName,
        courseName: row.courseName,
        criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria
      }));
    } else {
      // Use Excel parser for Excel files.
      coursesData = await excelParser.parseCourseFile(filePath);
    }
    
    // Save course/professor information to the database.
    const savedCourses = await Course.bulkCreate(coursesData);
    res.json({ message: 'Course file processed and courses saved', courses: savedCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  processCV,
  processCourseFile,
};
