// utils/excelGenerator.js
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// Ensure the exports folder exists
const exportsDir = 'exports';
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

export async function generateCandidatesExcel(candidates) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Candidates');

  // Define columns
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Resume Path', key: 'resumePath', width: 30 },
    { header: 'Degree', key: 'degree', width: 30 },
    { header: 'GPA', key: 'gpa', width: 10 },
    { header: 'Skills', key: 'skills', width: 40 },
    { header: 'Work Experience Entries', key: 'workExperienceEntries', width: 50 }
  ];

  // Add each candidate as a row
  candidates.forEach(candidate => {
    worksheet.addRow({
      name: candidate.name,
      email: candidate.email,
      resumePath: candidate.resumePath,
      degree: candidate.degree,
      gpa: candidate.gpa,
      skills: Array.isArray(candidate.skills) ? candidate.skills.join('; ') : candidate.skills,
      workExperienceEntries: Array.isArray(candidate.workExperienceEntries)
        ? JSON.stringify(candidate.workExperienceEntries)
        : candidate.workExperienceEntries
    });
  });

  const outputPath = path.join(exportsDir, 'candidates.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  return outputPath;
}
