// src/controllers/exportController.js
import db from '../models/index.js';
import { generateCSV } from '../utils/csvGenerator.js';
import { generateExcel } from '../utils/excelGenerator.js';
import transformApplicant from '../utils/transformApplicant.js';

const { Applicant } = db;

export const exportCSV = async (req, res) => {
  try {
    const applicants = await Applicant.findAll();
    const applicantData = applicants.map(c => c.toJSON());
    // Transform the applicant data to remove heavy experience descriptions.
    const lightweightApplicantData = transformApplicant.transformApplicantsForListing(applicantData);
    const filePath = './exports/applicants.csv';
    await generateCSV(lightweightApplicantData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const applicants = await Applicant.findAll();
    const applicantData = applicants.map(c => c.toJSON());
    const lightweightApplicantData = transformApplicant.transformApplicantsForListing(applicantData);
    const filePath = './exports/applicants.xlsx';
    await generateExcel(lightweightApplicantData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { exportCSV, exportExcel };
