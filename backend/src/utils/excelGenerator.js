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

  // Define columns
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 20 },
    { header: 'Education', key: 'education', width: 30 },
    { header: 'GPA', key: 'gpa', width: 10 },
    { header: 'Skills', key: 'skills', width: 50 },
    { header: 'Experience', key: 'experience', width: 50 },
  ];

  data.forEach(candidate => {
    worksheet.addRow({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || '',
      education: candidate.education || '',
      gpa: candidate.gpa || '',
      skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills,
      experience: Array.isArray(candidate.experience)
        ? candidate.experience
            .map(entry =>
              `Company: ${entry.company} | Role: ${entry.role} | Duration: ${entry.duration} | Description: ${entry.description.join(' ')}`
            )
            .join('\n')
        : candidate.experience,
    });
  });

  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

export default { generateExcel };
