// src/controllers/exportController.js
import db from '../models/index.js';
import { generateCSV } from '../utils/csvGenerator.js';
import { generateExcel } from '../utils/excelGenerator.js';
import transformCandidates from '../utils/transformCandidate.js';

const { Candidate } = db;

export const exportCSV = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const candidateData = candidates.map(c => c.toJSON());
    // Transform the candidate data to remove heavy experience descriptions.
    const lightweightCandidateData = transformCandidates.transformCandidatesForListing(candidateData);
    const filePath = './exports/candidates.csv';
    await generateCSV(lightweightCandidateData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const candidateData = candidates.map(c => c.toJSON());
    const lightweightCandidateData = transformCandidates.transformCandidatesForListing(candidateData);
    const filePath = './exports/candidates.xlsx';
    await generateExcel(lightweightCandidateData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { exportCSV, exportExcel };
