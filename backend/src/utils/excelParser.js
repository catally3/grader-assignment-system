import XLSX from 'xlsx';

/**
 * Read an Excel file of candidates and return an array
 * of objects shaped to your Applicant model.
 */
export const parseCandidateFile = async (filePath) => {
  // 1) Load workbook & first sheet, skip the bogus header row
  const workbook   = XLSX.readFile(filePath);
  const sheetName  = workbook.SheetNames[0];
  const worksheet   = workbook.Sheets[sheetName];
  const rawRows    = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',     // empty cells → ''
    range: 1        // skip Excel row 1, use row 2 as header
  });

  return rawRows.map(row => {
    // 2) Pull out exactly the columns your SQL expects:
    const studentId       = row['Student ID']                   || '';
    const documentId      = row['Document IDs']                 || '';
    // const semester        = row['Semester']                     || null;
    const firstName       = row['Student First Name']           || '';
    const lastName        = row['Student Last Name']            || '';
    const email           = row['Student Email']                || '';
    const schoolYear      = row['Student School Year Name']     || '';
    const university      = row['Student School']               || '';
    const school          = row['Student Primary College']      || '';
    const graduationDate  = row['Student Graduation Date']      || '';
    const major           = row['Majors']                       || '';
    const qualifiedRaw    = row['Fully Qualified']              || '';
    const continuingRaw   = row['Continuing']                   || row['Continuing?'] || '';
    const gpa             = parseFloat(row['GPA'])              || undefined;
    const resumePath      = row['Resume Path']                  || undefined;

    // 3) Build the object to bulkCreate:
    return {
      student_id:      String(studentId),
      document_id:     String(documentId),
      // semester,        // if null or undefined, Sequelize will apply its defaultValue
      applicant_name:  `${firstName} ${lastName}`.trim(),
      applicant_email: email,
      school_year:     schoolYear,
      university,
      school,
      graduation_date: graduationDate,
      major,
      qualified:       /^y(es)?$/i.test(String(qualifiedRaw)),
      continuing:      /^y(es)?$/i.test(String(continuingRaw)),
      gpa,
      resume_path:     resumePath,
      skills:          [],  // PDF parsing will fill this later
      experience:      []
    };
  });
};

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

export default { parseCandidateFile, parseCourseFile };
