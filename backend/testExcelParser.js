// testExcelParser.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import excelParser from './src/utils/excelParser.js'; // adjust the relative path as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function testParseCourseFile() {
  // Adjust the filename to match your actual file in uploads/files/
  const courseFile = path.join(__dirname, './src/uploads/files/filled_professor_courselist 1.xlsx');
  if (!fs.existsSync(courseFile)) {
    console.error(`❌ Course file not found at: ${courseFile}`);
    return;
  }
  console.log(`\n📄 Parsing courses from: ${courseFile}\n`);
  try {
    const courses = await excelParser.parseCourseFile(courseFile);
    console.log('✅ Parsed Courses:\n', JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('❌ Error parsing course file:', err);
  }
}

async function testParseCandidateFile() {
  if (typeof excelParser.parseCandidateFile !== 'function') {
    console.warn('\n⚠️  parseCandidateFile not implemented, skipping candidate test.\n');
    return;
  }
  // Adjust the filename to match your actual file in uploads/files/
  const candidateFile = path.join(__dirname, './src/uploads/files/sp25-candidatelist 2.xlsx');
  if (!fs.existsSync(candidateFile)) {
    console.error(`❌ Candidate list file not found at: ${candidateFile}`);
    return;
  }
  console.log(`\n🧑‍🎓 Parsing candidates from: ${candidateFile}\n`);
  try {
    const candidates = await excelParser.parseCandidateFile(candidateFile);
    console.log('✅ Parsed Candidates:\n', JSON.stringify(candidates, null, 2));
  } catch (err) {
    console.error('❌ Error parsing candidate file:', err);
  }
}

async function main() {
  // await testParseCourseFile();
  await testParseCandidateFile();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Test script failed:', err);
    process.exit(1);
  });
}