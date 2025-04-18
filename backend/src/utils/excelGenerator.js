import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export const generateExcel = async (data, filePath) => {
  // Ensure the export directory exists
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Candidates');

  // Define columns that match your Candidate model / init.sql order.
  worksheet.columns = [
    { header: 'Applicant ID', key: 'applicantId', width: 15 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 20 },
    { header: 'Resume Path', key: 'resumePath', width: 30 },
    { header: 'Education', key: 'education', width: 20 },
    { header: 'GPA', key: 'gpa', width: 10 },
    { header: 'Skills', key: 'skills', width: 50 },
    { header: 'Experience', key: 'experience', width: 50 },
  ];

  // Add rows with proper formatting.
  data.forEach(candidate => {
    worksheet.addRow({
      applicantId: candidate.applicantId || '',
      name: candidate.name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      resumePath: candidate.resumePath || '',
      education: candidate.education || '',
      gpa: candidate.gpa !== undefined ? candidate.gpa : '',
      skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills || '',
      experience: Array.isArray(candidate.experience)
      ? candidate.experience
          .map(entry => {
            const descriptionText = Array.isArray(entry.description)
              ? entry.description.join(' ')
              : entry.description || '';
            return `Company: ${entry.company || ''} | Role: ${entry.role || ''} | Duration: ${entry.duration || ''} | Description: ${descriptionText}`;
          })
          .join('\n')
      : candidate.experience || '',
    });
  });

  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

export default { generateExcel };
