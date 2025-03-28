import fs from 'fs';
import path from 'path';
import processMergedPDFWithOCR from './testSplitPDF.js'; // our OCR splitting module
import parseResumePdf from './testPDFParsing.js';                // our PDF parsing module

async function processMergedPDF() {
  try {
    // Path to your merged PDF file.
    const mergedPdfPath = './src/uploads/resumes/sample_cv.pdf';
    // Directory where split resume PDFs will be saved.
    const outputDir = './src/output/resumes';

    // Step 1: Split the merged PDF into individual resume PDFs.
    // processMergedPDFWithOCR is assumed to return an array of file paths.
    const resumeFiles = await processMergedPDFWithOCR.processMergedPDFWithOCR(mergedPdfPath, outputDir);
    console.log("Split resume files:", resumeFiles);

    // Step 2: Parse each individual resume PDF to extract candidate data.
    const candidateDataArray = [];
    for (const filePath of resumeFiles) {
      // parseResumePdf returns an array (typically with one candidate object)
      const parsedData = await parseResumePdf.parseResumePdf(filePath);
      if (parsedData && parsedData.length > 0) {
        candidateDataArray.push(...parsedData);
      }
    }
    
    console.log("Candidate Data Extracted:", candidateDataArray);
    
    // Optionally, save the candidate data to a JSON file.
    const outputJsonPath = path.join(outputDir, 'candidateData.json');
    fs.writeFileSync(outputJsonPath, JSON.stringify(candidateDataArray, null, 2));
    console.log(`Candidate data saved to ${outputJsonPath}`);
    
    return candidateDataArray;
  } catch (error) {
    console.error("Error processing merged PDF:", error);
    throw error;
  }
}

// Run the process and log the results.
processMergedPDF()
  .then((data) => {
    console.log("Processing complete. Candidate data:", data);
  })
  .catch((err) => {
    console.error("Processing failed:", err);
  });