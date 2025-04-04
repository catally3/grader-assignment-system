import path from 'path';
// import processMergedPDFWithOCR from '../utils/splitPDF.js';
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
      coursesData = coursesData.map(row => {
        // Extract and process the Keywords field.
        let keywords = row['Keywords'] || row.keywords || '';
        if (typeof keywords === 'string' && keywords.trim() !== '') {
          try {
            keywords = JSON.parse(keywords);
          } catch (err) {
            // If JSON parsing fails, retain the raw string.
          }
        }
        
        return {
          professorName: row['Professor Name'] || row.professorName || '',
          professorEmail: row['Professor Email'] || row.professorEmail || '',
          courseNumber: row['Course Number'] || row.courseNumber || '',
          section: row['Section'] || row.section || '',
          courseName: row['Course Name'] || row.courseName || '',
          recommendedStudentName: row['Recommended Student Name'] || row.recommendedStudentName || '',
          recommendedStudentNetid: row['Recommended Student Netid'] || row.recommendedStudentNetid || '',
          numOfGraders: row['Num of graders'] || row.numOfGraders || '',
          keywords: keywords
        };
      });
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
