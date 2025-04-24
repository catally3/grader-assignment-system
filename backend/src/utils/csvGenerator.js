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
      { id: 'applicantId', title: 'Applicant ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'resumePath', title: 'Resume Path' },
      { id: 'education', title: 'Education' },
      { id: 'gpa', title: 'GPA' },
      { id: 'skills', title: 'Skills' },
      { id: 'experience', title: 'Experience' }
    ]
  });

  // Format the candidate data for CSV
  // (Adjust formatting as necessary – for example, converting arrays to comma-separated strings)
  const formattedCandidates = candidates.map(candidate => ({
    applicantId: candidate.applicantId || '',
    name: candidate.name || '',
    email: candidate.email || '',
    // Ensure phone is output as a text formula to prevent Excel issues.
    phone: candidate.phone ? `="${candidate.phone}"` : "",
    resumePath: candidate.resumePath || '',
    education: candidate.education || '', // Use education if degree not set
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
  }));

  await csvWriter.writeRecords(formattedCandidates);
  return filePath;
};

export default { generateCSV };
