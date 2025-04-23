// testParseAndBuild.js

import fs from 'fs';
import path from 'path';
import db from './src/models/index.js';
import pdfParser from './src/utils/pdfParser.js';

// Destructure your model
const { Applicant } = db;

async function main() {
  const zipPath = './src/uploads/others/resumes.zip';
  if (!fs.existsSync(zipPath)) {
    console.error(`Test ZIP file not found at path: ${zipPath}`);
    process.exit(1);
  }

  console.log(`\n📦 Parsing resumes from: ${zipPath}\n`);
  // correctly call the default export
  const applicantsData = await pdfParser.parseZipResumes(zipPath);

  // Build instances (applies defaultValue)
  const instances = applicantsData.map(data => Applicant.build(data));

  console.log('✅ Built Applicant instances with defaults applied:\n');
  instances.forEach((inst, i) => {cls
    
    console.log(`--- Applicant #${i + 1} ---`);
    // .get({plain:true}) returns all fields, including defaults
    console.log(JSON.stringify(inst.get({ plain: true }), null, 2));
    console.log();
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(err => {
    console.error('❌ Error in test:', err);
    process.exit(1);
  });
}