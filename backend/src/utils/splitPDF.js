import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { fromPath } from 'pdf2pic';
import tesseract from 'node-tesseract-ocr';

// Use psm 6 for structured OCR.
const tesseractConfig = {
  lang: "eng",
  oem: 1,
  psm: 6,
  // Uncomment and adjust if Tesseract isn’t in your PATH:
  // tesseractPath: "/usr/bin/tesseract"
};

/**
 * Run OCR on an image file.
 * @param {string} imagePath - Path to the image file.
 * @returns {Promise<string>} Extracted text.
 */
async function ocrPageImage(imagePath) {
  try {
    const text = await tesseract.recognize(imagePath, tesseractConfig);
    return text;
  } catch (error) {
    console.error(`Error OCR-ing ${imagePath}:`, error);
    return "";
  }
}

/**
 * Checks whether a page appears to be the start of a resume by examining its first 5 lines.
 * Looks for cues such as an email address, a phone number, a short candidate name, or the phrase "WORK EXPERIENCE."
 * @param {string} pageText - OCR text of a page.
 * @returns {boolean} True if the page is likely a resume header.
 */
function isResumeHeader(pageText) {
  const lines = pageText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const firstLines = lines.slice(0, 5);
  
  const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/;
  const hasEmail = firstLines.some(line => emailPattern.test(line));
  
  const phonePattern = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4})/;
  const hasPhone = firstLines.some(line => phonePattern.test(line));
  
  // Candidate name heuristic: first line is short (< 30 chars) and only letters/spaces.
  const firstLine = firstLines[0] || "";
  const isName = firstLine.length > 0 && firstLine.length < 30 && /^[A-Za-z\s]+$/.test(firstLine);
  
  const hasWorkExp = firstLines.some(line => /WORK EXPERIENCE/i.test(line));
  
  return hasEmail || hasPhone || isName || hasWorkExp;
}

/**
 * Groups pages (by index) into resume groups using the header heuristic.
 * A new group starts whenever a page is flagged as a resume header.
 * @param {string[]} pagesText - Array of OCR texts for each page.
 * @returns {number[][]} Array of groups (each group is an array of page indices).
 */
function groupPagesIntoResumes(pagesText) {
  const groups = [];
  let currentGroup = [];
  for (let i = 0; i < pagesText.length; i++) {
    const text = pagesText[i].trim();
    if (!text) continue;
    if (isResumeHeader(text)) {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [i];
    } else {
      currentGroup.push(i);
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

/**
 * Filters out groups that appear to be index pages.
 * Discards any group whose combined text contains "Application Download".
 * @param {number[][]} groups - Array of page index groups.
 * @param {string[]} pagesText - OCR texts for each page.
 * @returns {number[][]} Filtered groups.
 */
function filterIndexGroups(groups, pagesText) {
  return groups.filter(group => {
    const combinedText = group.map(i => pagesText[i]).join(" ");
    return !/Application Download/i.test(combinedText);
  });
}

/**
 * Extracts a candidate name from text by scanning each line and returning the first line that
 * matches the pattern of two consecutive capitalized words (e.g., "Jon Smith").
 * @param {string} text - OCR text.
 * @returns {string} The candidate name if found; otherwise, an empty string.
 */
function extractCandidateName(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const namePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+/;
  for (const line of lines) {
    const match = line.match(namePattern);
    if (match) return match[0];
  }
  return "";
}

/**
 * Merges adjacent groups if the candidate header in the second group is ambiguous.
 * Here, if the second group’s first line does not match a valid candidate name pattern,
 * we merge the groups.
 * @param {number[][]} groups - Array of page index groups.
 * @param {string[]} pagesText - OCR texts for each page.
 * @returns {number[][]} Merged groups.
 */
function mergeAmbiguousGroups(groups, pagesText) {
  if (groups.length === 0) return groups;
  const merged = [];
  let current = groups[0];
  
  // Define a valid candidate name pattern: two consecutive capitalized words.
  const validNamePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+$/;
  
  for (let i = 1; i < groups.length; i++) {
    const nextFirstLine = pagesText[groups[i][0]].split('\n')[0].trim();
    // If the next group’s first line does not match a valid candidate name, merge.
    if (!validNamePattern.test(nextFirstLine)) {
      current = current.concat(groups[i]);
    } else {
      merged.push(current);
      current = groups[i];
    }
  }
  merged.push(current);
  return merged;
}

/**
 * Processes a merged PDF using OCR:
 *  1. Converts each page to an image.
 *  2. Runs OCR on each image.
 *  3. Groups pages into resume groups using the header heuristic.
 *  4. Filters out groups that appear to be index pages.
 *  5. Merges adjacent groups if candidate headers are ambiguous.
 *  6. Splits the merged PDF into separate PDF files for each resume.
 *  7. Returns an array of file paths for the split resumes.
 * @param {string} mergedPdfPath - Path to the merged PDF.
 * @param {string} outputDir - Directory to save output.
 * @returns {Promise<string[]>} Array of split resume file paths.
 */
async function processMergedPDFWithOCR(mergedPdfPath, outputDir) {
  try {
    // Create output directories.
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const tempImageDir = path.join(outputDir, 'temp_images');
    if (!fs.existsSync(tempImageDir)) fs.mkdirSync(tempImageDir, { recursive: true });
    
    // Load the merged PDF.
    const pdfBuffer = fs.readFileSync(mergedPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    console.log(`Total pages in PDF: ${pageCount}`);
    
    // Convert each page to an image.
    const converter = fromPath(mergedPdfPath, {
      density: 300,
      saveFilename: 'page',
      savePath: tempImageDir,
      format: 'png',
      width: 1240,
      height: 1754
    });
    
    const pagesText = [];
    for (let i = 1; i <= pageCount; i++) {
      console.log(`Converting page ${i} to image...`);
      const result = await converter(i);
      console.log(`Running OCR on page ${i}...`);
      const text = await ocrPageImage(result.path);
      pagesText.push(text);
      console.log(`OCR for page ${i}: ${text.slice(0, 100)}...`);
    }
    
    // Group pages using the header heuristic.
    let groups = groupPagesIntoResumes(pagesText);
    console.log(`Initially grouped pages into ${groups.length} group(s):`, groups);
    
    // Filter out index groups.
    groups = filterIndexGroups(groups, pagesText);
    console.log(`After filtering index pages, ${groups.length} group(s) remain:`, groups);
    
    // Log each group's first line for inspection.
    groups.forEach((group, idx) => {
      const combinedText = group.map(i => pagesText[i]).join("\n");
      const firstLine = combinedText.split('\n')[0];
      console.log(`Group ${idx + 1} first line: "${firstLine}"`);
    });
    
    // Merge adjacent ambiguous groups.
    const mergedGroups = mergeAmbiguousGroups(groups, pagesText);
    console.log(`After merging ambiguous groups, ${mergedGroups.length} group(s) remain:`, mergedGroups);
    
    // Expected grouping (assuming pages 1-indexed):
    // resume_1: page 1, resume_2: pages 2-3, resume_3: pages 4-5, resume_4: page 6, resume_5: pages 7-8,
    // resume_6: pages 9-10, resume_7: page 11, resume_8: pages 12-13, resume_9: page 14, resume_10: page 15,
    // resume_11: page 16, resume_12: page 17, resume_13: pages 18-20, resume_14: page 21, resume_15: page 22, resume_16: page 23.
    
    // Create output directory for resumes.
    const outputResumeDir = path.join(outputDir, 'resumes');
    if (!fs.existsSync(outputResumeDir)) fs.mkdirSync(outputResumeDir, { recursive: true });
    
    const outputFiles = [];
    let resumeCount = 0;
    for (let i = 0; i < mergedGroups.length; i++) {
      const group = mergedGroups[i];
      const newPdfDoc = await PDFDocument.create();
      const pagesToCopy = await newPdfDoc.copyPages(pdfDoc, group);
      pagesToCopy.forEach(page => newPdfDoc.addPage(page));
      const pdfBytes = await newPdfDoc.save();
      resumeCount++;
      const outputFilename = path.join(outputResumeDir, `resume_${resumeCount}.pdf`);
      fs.writeFileSync(outputFilename, pdfBytes);
      console.log(`Saved resume_${resumeCount}.pdf with pages: ${group.join(', ')}`);
      outputFiles.push(outputFilename);
    }
    
    console.log('All resumes have been processed and saved.');
    // Optionally, remove temporary images:
    // fs.rmSync(tempImageDir, { recursive: true, force: true });
    
    return outputFiles;
    
  } catch (error) {
    console.error('Error during processing:', error);
    throw error;
  }
}

// // Change the paths below as needed.
// const mergedPdfPath = './src/uploads/resumes/sample_cv.pdf'; // Path to your merged PDF file.
// const mergedPdfPath = './src/uploads/resumes/Resumes.pdf'; // Path to your merged PDF file.
// const outputDir = './src/output/resumes/';                   // Directory to save the split PDFs.

// processMergedPDFWithOCR(mergedPdfPath, outputDir);
export default { processMergedPDFWithOCR };