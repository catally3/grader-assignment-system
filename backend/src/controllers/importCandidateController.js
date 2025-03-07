// backend/src/controllers/importCandidateController.js

const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.uploadCandidates = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const pool = req.app.locals.pool;
  const filePath = req.file.path;
  const fileExt = req.file.originalname.split('.').pop().toLowerCase();

  try {
    let candidates = [];
    if (fileExt === 'csv') {
      // Parse CSV file.
      candidates = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    } else if (fileExt === 'xlsx') {
      // Parse Excel file.
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      candidates = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileExt === 'pdf') {
      // Advanced PDF parsing for merged resumes.
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      // Split the extracted text into lines.
      const lines = data.text.split('\n');
      const candidateBlocks = [];
      let currentBlock = "";
      
      // Heuristic: We assume a new resume begins when we see a line that matches a full name.
      // For instance, a simple regex that matches two or more words starting with an uppercase letter.
      // You can add additional keywords (like "WORK EXPERIENCE" or "EDUCATION") if they reliably indicate a new resume.
      const nameRegex = /^[A-Z][a-z]+( [A-Z][a-z]+)+$/;
      
      for (const line of lines) {
        const trimmed = line.trim();
        // If the line is non-empty and looks like a name, consider it as a potential new resume header.
        if (trimmed && nameRegex.test(trimmed)) {
          // Optionally, you can add further checks (for example, length of line, or adjacent lines having contact info)
          if (currentBlock.trim().length > 0) {
            candidateBlocks.push(currentBlock);
            currentBlock = "";
          }
        }
        currentBlock += line + "\n";
      }
      // Push any remaining text as the last candidate block.
      if (currentBlock.trim().length > 0) {
        candidateBlocks.push(currentBlock);
      }
      
      // Process each candidate block to extract information.
      candidates = candidateBlocks.map(textBlock => {
        const nameMatch = textBlock.match(/^[A-Z][a-z]+( [A-Z][a-z]+)+/m); // match the first line that looks like a name
        const majorMatch = textBlock.match(/Major:\s*(.*)/i);
        const gpaMatch = textBlock.match(/GPA:\s*([\d\.]+)/i);
        const continuingMatch = textBlock.match(/Continuing:\s*(true|false)/i);
        const coursesMatch = textBlock.match(/Courses Taken:\s*(.*)/i);
        return {
          name: nameMatch ? nameMatch[0].trim() : 'Unknown',
          major: majorMatch ? majorMatch[1].trim() : 'Unknown',
          gpa: gpaMatch ? parseFloat(gpaMatch[1]) : 0,
          is_continuing: continuingMatch ? (continuingMatch[1].toLowerCase() === 'true') : false,
          courses_taken: coursesMatch ? coursesMatch[1].trim() : ''
        };
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    // Insert candidate records into the database.
    // Assumes table candidates has columns: name, major, gpa, is_continuing, courses_taken.
    for (let candidate of candidates) {
      await pool.query(
        'INSERT INTO candidates (name, major, gpa, is_continuing, courses_taken) VALUES (?, ?, ?, ?, ?)',
        [
          candidate.name,
          candidate.major,
          candidate.gpa,
          candidate.is_continuing ? 1 : 0,
          candidate.courses_taken || ''
        ]
      );
    }

    // Remove the file after processing.
    // fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Candidates imported successfully.', count: candidates.length });
  } catch (error) {
    console.error('Error importing candidates:', error);
    res.status(500).json({ error: 'Error importing candidates.' });
  }
};
