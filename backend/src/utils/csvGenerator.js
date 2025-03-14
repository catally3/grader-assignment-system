import fs from 'fs';
import path from 'path';
import createCsvWriter from 'csv-writer';

export const generateCSV = async (candidates, filePath) => {
  // Ensure the export directory exists
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const csvWriter = createCsvWriter.createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'education', title: 'Education' },
      { id: 'gpa', title: 'GPA' },
      { id: 'skills', title: 'Skills' },
      { id: 'experience', title: 'Experience' }
    ]
  });

  // Format the candidate data for CSV
  const formattedCandidates = candidates.map(candidate => ({
    ...candidate,
    skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills,
    experience: Array.isArray(candidate.experience)
      ? candidate.experience
          .map(entry =>
            `Company: ${entry.company} | Role: ${entry.role} | Duration: ${entry.duration} | Description: ${entry.description.join(' ')}`
          )
          .join('\n')
      : candidate.experience,
  }));  

  await csvWriter.writeRecords(formattedCandidates);
  return filePath;
};

export default { generateCSV };
