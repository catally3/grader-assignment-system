import path from 'path';
// import processMergedPDFWithOCR from '../utils/splitPDF.js';
import pdfParser from '../utils/pdfParser.js';
import excelParser from '../utils/excelParser.js';
import csvParser from '../utils/csvParser.js';
import { generateCSV } from '../utils/csvGenerator.js';
import { generateExcel } from '../utils/excelGenerator.js';
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

const processMergedPDF = async (req, res) => {
  try {
    const filePath = req.file.path; // path to the merged PDF file
    const outputDir = './exports/resumes'; // or any directory you prefer
    const splitFiles = await splitMergedPdf(filePath, outputDir);
    res.json({ message: 'Merged PDF split into individual resumes', files: splitFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Process a merged PDF: split it, parse each individual resume,
 * save candidate data into the database, and then generate CSV and Excel exports.
 */
export const processMergedPDFPipeline = async (req, res) => {
  try {
    const mergedFilePath = req.file.path;
    const splitOutputDir = './exports/resumes';

    // Step 1: Split the merged PDF into individual PDFs.
    const resumeFiles = await processMergedPDFWithOCR(mergedFilePath, splitOutputDir);
    
    // Step 2: For each individual PDF, parse the resume data.
    const candidateDataArray = [];
    for (const filePath of resumeFiles) {
      const candidateData = await pdfParser.parseResumePdf(filePath);
      // Assume parseResumePdf returns an array with one candidate object.
      candidateDataArray.push(...candidateData);
    }
    
    // Step 3: Save parsed candidate data to the database.
    const savedCandidates = await Candidate.bulkCreate(candidateDataArray);
    
    // Step 4: Generate CSV and Excel exports.
    const csvPath = './exports/candidates.csv';
    const excelPath = './exports/candidates.xlsx';
    await generateCSV(candidateDataArray, csvPath);
    await generateExcel(candidateDataArray, excelPath);
    
    // Respond with details.
    res.json({
      message: 'Merged PDF processed; candidates saved and export files generated.',
      savedCandidates,
      exportFiles: { csv: csvPath, excel: excelPath }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  processCV,
  processCourseFile,
  // processMergedPDF, // add this new function
  // processMergedPDFPipeline
};
