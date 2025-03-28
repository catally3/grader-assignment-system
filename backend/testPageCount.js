import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function getPageCount(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(dataBuffer);
  console.log("Total pages:", pdfDoc.getPageCount());
}

getPageCount('./src/uploads/resumes/sample_cv.pdf');