import XLSX from 'xlsx';

async function parseCourseFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    // Assume each row has: professorName, courseName, and criteria (JSON or string).
    const courses = data.map(row => ({
      professorName: row.professorName,
      courseName: row.courseName,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria
    }));
    return courses;
  } catch (err) {
    throw new Error("Excel Parsing failed: " + err.message);
  }
}

export default parseCourseFile;
