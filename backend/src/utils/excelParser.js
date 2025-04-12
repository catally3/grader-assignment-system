import XLSX from 'xlsx';

export const parseCourseFile = async (filePath) => {
  try {
    // Read the Excel workbook from the file path.
    const workbook = XLSX.readFile(filePath);
    // Assuming the first sheet contains the course/professor data.
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet data to a JSON array.
    // The option defval: '' ensures empty cells are returned as empty strings.
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    // Map each row to a course object based on the headers from the Excel file.
    const courses = rows.map(row => {
      // Extract values using the header names from the Excel file.
      const professorName = row['Professor Name'] || '';
      const professorEmail = row['Professor Email'] || '';
      const courseNumber = row['Course Number'] || '';
      const section = row['Section'] || '';
      const courseName = row['Course Name'] || '';
      const recommendedStudentName = row['Recommended Student Name'] || '';
      const recommendedStudentNetid = row['Recommended Student Netid'] || '';
      const numOfGraders = row['Num of graders'] || '';
      let keywords = row['Keywords'] || '';

      // Attempt to parse keywords as JSON if applicable.
      if (typeof keywords === 'string' && keywords.trim() !== '') {
        try {
          keywords = JSON.parse(keywords);
        } catch (err) {
          // If JSON parsing fails, keep the raw string value.
        }
      }

      return {
        professorName,
        professorEmail,
        courseNumber,
        section,
        courseName,
        recommendedStudentName,
        recommendedStudentNetid,
        numOfGraders,
        keywords
      };
    });

    return courses;
  } catch (err) {
    throw new Error("Excel Parsing failed: " + err.message);
  }
};

export default { parseCourseFile };
