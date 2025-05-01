// testCourseParser.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import excelParser from './src/utils/excelParser.js';
import csvParser from './src/utils/csvParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function testExcel() {
  const file = path.join(__dirname, 'src/uploads/files/filled_professor_courselist 1.xlsx');
  // const file = path.join(__dirname, 'src/uploads/files/sp25-candidatelist 2.xlsx');

  if (!fs.existsSync(file)) {
    console.error(`❌ Excel file not found at: ${file}`);
    return;
  }
  console.log(`\n📊 Parsing Excel courses from: ${file}\n`);
  try {
    const rows = await excelParser.parseCourseFile(file);
    // console.log('✅ Parsed rows:\n', JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('❌ Excel parse error:', err);
  }
}

async function testCSV() {
  const file = path.join(__dirname, 'src/uploads/files/filled_professor_courselist.csv');
  if (!fs.existsSync(file)) {
    console.warn(`⚠️  CSV file not found at: ${file}, skipping CSV test.`);
    return;
  }
  console.log(`\n📄 Parsing CSV courses from: ${file}\n`);
  try {
    const raw = await csvParser.parseCSVFile(file);
    const rows = raw.map(r => ({
      semester:               r.semester,
      professor_name:         r.professorName,
      professor_email:        r.professorEmail,
      course_number:          r.courseNumber,
      course_section:         r.section,
      course_name:            r.courseName,
      number_of_graders:      parseInt(r.numOfGraders, 10),
      keywords:               Array.isArray(r.criteria)
                                ? r.criteria
                                : JSON.parse(r.criteria || '[]'),
      recommended_student_name: r.recommendedStudentName,
      recommended_student_netid: r.recommendedStudentNetid
    }));
    console.log('✅ Parsed CSV rows:\n', JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('❌ CSV parse error:', err);
  }
}

async function main() {
  await testExcel();
  // await testCSV();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Test script failed:', err);
    process.exit(1);
  });
}
