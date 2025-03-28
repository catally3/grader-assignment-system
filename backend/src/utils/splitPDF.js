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
  // Uncomment and adjust the following if Tesseract isn’t in your PATH:
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
 * Heuristic to decide if a page appears to be a resume header.
 * Checks the first 5 lines for cues such as an email, phone number,
 * a candidate name (a short line with only letters/spaces), or "WORK EXPERIENCE".
 *
 * @param {string} pageText - OCR text of a page.
 * @returns {boolean} True if the page likely starts a resume.
 */
function isResumeHeader(pageText) {
  const lines = pageText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const firstLines = lines.slice(0, 5);
  
  const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/;
  const hasEmail = firstLines.some(line => emailPattern.test(line));
  
  const phonePattern = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4})/;
  const hasPhone = firstLines.some(line => phonePattern.test(line));
  
  // Candidate name: short (less than 30 characters) and only letters/spaces.
  const firstLine = firstLines[0] || "";
  const isName = firstLine.length > 0 && firstLine.length < 30 && /^[A-Za-z\s]+$/.test(firstLine);
  
  const hasWorkExp = firstLines.some(line => /WORK EXPERIENCE/i.test(line));
  
  return hasEmail || hasPhone || isName || hasWorkExp;
}

/**
 * Groups pages (by index) into resume groups using the header heuristic.
 * A new group is started whenever a page is flagged as a resume header.
 *
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
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [i];
    } else {
      currentGroup.push(i);
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

/**
 * Filters out groups that look like index pages.
 * Discards any group whose combined text contains "Application Download".
 *
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
 * Processes a merged PDF using OCR:
 *  1. Converts each page to an image.
 *  2. Runs OCR on each image.
 *  3. Groups pages into resume groups using the header heuristic.
 *  4. Filters out groups that appear to be index pages.
 *  5. Splits the merged PDF into separate PDFs for each resume.
 *
 * @param {string} mergedPdfPath - Path to the merged PDF.
 * @param {string} outputDir - Directory to save output.
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
    
    // Convert each page to an image using pdf2pic.
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
    
    // Group pages into resume groups.
    let resumeGroups = groupPagesIntoResumes(pagesText);
    console.log(`Initially grouped pages into ${resumeGroups.length} group(s):`, resumeGroups);
    
    // Filter out groups that appear to be index pages.
    resumeGroups = filterIndexGroups(resumeGroups, pagesText);
    console.log(`After filtering index pages, ${resumeGroups.length} group(s) remain:`, resumeGroups);
    
    // For manual inspection: log each group's first line.
    resumeGroups.forEach((group, idx) => {
      const combinedText = group.map(i => pagesText[i]).join("\n");
      const firstLine = combinedText.split('\n')[0];
      console.log(`Group ${idx + 1} first line: "${firstLine}"`);
    });
    
    // At this point, we expect 16 groups.
    // Create output directory for resumes.
    const outputResumeDir = path.join(outputDir, 'resumes');
    if (!fs.existsSync(outputResumeDir)) fs.mkdirSync(outputResumeDir, { recursive: true });
    
    let resumeCount = 0;
    for (let i = 0; i < resumeGroups.length; i++) {
      const group = resumeGroups[i];
      const newPdfDoc = await PDFDocument.create();
      const pagesToCopy = await newPdfDoc.copyPages(pdfDoc, group);
      pagesToCopy.forEach(page => newPdfDoc.addPage(page));
      const pdfBytes = await newPdfDoc.save();
      resumeCount++;
      const outputFilename = path.join(outputResumeDir, `resume_${resumeCount}.pdf`);
      fs.writeFileSync(outputFilename, pdfBytes);
      console.log(`Saved resume_${resumeCount}.pdf with pages: ${group.join(', ')}`);
    }
    
    console.log('All resumes have been processed and saved.');
    // Optionally, remove temporary images:
    // fs.rmSync(tempImageDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error('Error during processing:', error);
  }
}

export default { processMergedPDFWithOCR };