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
  
  console.log('🔎 rawRows:', rawRows);

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
  const workbook  = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const ws        = workbook.Sheets[sheetName];

  // Skip the first row if it’s junk, start parsing at row 2
  const rawRows = XLSX.utils.sheet_to_json(ws, {
    defval: '',    // empty cells → ''
    range: 0       // skip the very first row
  });

  console.log('🔎 rawRows:', rawRows);

  return rawRows.map(row => {
    // 2) Pull out exactly the columns your SQL expects:
    // const semester                    = row['Semester']                     || undefined;
    const professor_name              = row['Professor Name']               || '';
    const professor_email             = row['Professor Email']              || '';
    const course_number               = row['Course Number']                || '';
    const course_section              = row['Section']                      || '';
    const course_name                 = row['Course Name']                  || '';
    const recommended_student_name    = row['Recommended Student Name']     || '';
    const recommended_student_id      = row['Recommended Student ID']       || '';
    const number_of_graders           = parseInt(row['Num of graders'], 10) || undefined;

    // 3) Build the object to bulkCreate:
    return {
      professor_name:                 professor_name,
      professor_email:                professor_email,
      course_number:                  course_number,
      course_section:                 course_section,
      course_name:                    course_name,
      recommended_student_name:       recommended_student_name,
      recommended_student_id:         recommended_student_id,
      number_of_graders,
      keywords:                       (() => {
        let kw = row['Keywords'] || '';
        if (typeof kw === 'string' && kw.trim()) {
          try { return JSON.parse(kw); }
          catch { /* fall through */ }
        }
        return kw;
      })()              
    };
  });
};

export default { parseCandidateFile, parseCourseFile };
