import path from 'path';
import pdfParser from '../utils/pdfParser.js';
import excelParser from '../utils/excelParser.js';
import csvParser from '../utils/csvParser.js';
import db from '../models/index.js';
const { Candidate, Course } = db;

/**
 * Processes an uploaded ZIP file containing individual resume PDFs.
 */
const processResumeZip = async (req, res) => {
  try {
    const zipFilePath = req.file.path; // Path to the uploaded ZIP file.
    const candidatesData = await pdfParser.parseZipResumes(zipFilePath);
    // Save all the parsed candidate data to the database.
    const savedCandidates = await Candidate.bulkCreate(candidatesData);
    res.json({
      message: 'ZIP processed and candidates saved',
      candidates: savedCandidates
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Keep your existing processCV and processCourseFile functions here.
const processCV = async (req, res) => {
  try {
    const filePath = req.file.path;
    const candidatesData = await pdfParser.parseResumePdf(filePath);
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
