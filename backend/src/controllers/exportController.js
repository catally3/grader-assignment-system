import { generateCSV } from '../utils/csvGenerator.js';
import { generateExcel } from '../utils/excelGenerator.js';
import db from '../models/index.js';
const { Candidate } = db;

export const exportCSV = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const candidateData = candidates.map(c => c.toJSON());
    const filePath = './exports/candidates.csv';
    await generateCSV(candidateData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const candidateData = candidates.map(c => c.toJSON());
    const filePath = './exports/candidates.xlsx';
    await generateExcel(candidateData, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { exportCSV, exportExcel };
