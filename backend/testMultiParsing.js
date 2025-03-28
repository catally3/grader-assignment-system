import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fromPath } from 'pdf2pic';
import Tesseract from 'tesseract.js';

// __dirname polyfill for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This function extracts the section of text that follows one of the provided header keywords,
// until another header (any uppercase line) is encountered.
function extractSection(text, headerKeywords) {
  const lines = text.split('\n').map(line => line.trim());
  let start = -1;
  let end = lines.length;
  
  // Find the first line that contains any of the header keywords.
  for (let i = 0; i < lines.length; i++) {
    const upper = lines[i].toUpperCase();
    for (const keyword of headerKeywords) {
      if (upper.includes(keyword)) {
        start = i;
        break;
      }
    }
    if (start !== -1) break;
  }
  if (start === -1) return [];
  
  // Now, from the line after start, find the next line that looks like a header.
  // We assume that a header is any line that is in ALL CAPS (or nearly so) and contains alphabetic characters.
  for (let j = start + 1; j < lines.length; j++) {
    const line = lines[j];
    // If the line is very short or mostly underscores, skip it.
    if (/^[_\-]{2,}$/.test(line)) continue;
    // Check if the line is a header: for simplicity, we check if the line is all letters and spaces (and maybe some punctuation)
    // and if it is in uppercase.
    if (line.length > 0 && line === line.toUpperCase() && /[A-Z]/.test(line)) {
      end = j;
      break;
    }
  }
  // Return lines between start+1 and end.
  return lines.slice(start + 1, end).filter(l => l.length > 0);
}

/**
 * Parses bullet points from a SKILLS section.
 * It looks for lines that start with common bullet markers (•, -, *, or "o")
 * and also splits lines that may contain multiple bullet items.
 */
function parseSkills(skillsText) {
    // Normalize the skills text: remove newlines so that headers aren’t split.
    const cleanText = skillsText.replace(/\n/g, ' ');
    // Remove any unwanted header labels from the entire string.
    const cleanedText = cleanText.replace(/(Hard Skills:|Programming Languages:|Tools and Software:|don’t forget.*)/gi, '');
    // Now split the cleaned text on bullet markers (or commas if needed).
    const rawSkills = cleanedText.split(/[●•,]/);
    // Define unwanted prefixes for extra safety.
    const unwantedPrefixes = 
    ["Hard Skill:", "Hard Skills:", "Programming Languages:", 
      "Tools and Software:", "Soft Skills:", "Soft Skill:",
      "Technical Skills:", "Technical Skill:"];
    // Trim each skill and remove any unwanted prefix if it’s at the start.
    const skills = rawSkills
      .map(skill => {
        let s = skill.trim();
        for (const prefix of unwantedPrefixes) {
          if (s.toLowerCase().startsWith(prefix.toLowerCase())) {
            s = s.substring(prefix.length).trim();
          }
        }
        return s;
      })
      .filter(s => s.length > 0);
    return Array.from(new Set(skills)); // Remove duplicates if any.
  }

/**
 * (The other functions remain largely unchanged)
 */

// Example: a basic degree parser from the EDUCATION section.
function parseEducation(eduLines) {
  for (let i = 0; i < eduLines.length; i++) {
    if (/Bachelor|Master|Ph\.?D/i.test(eduLines[i])) {
      let degreeLine = eduLines[i];
      if (i + 1 < eduLines.length && /^[A-Za-z\s]+$/.test(eduLines[i + 1]) && eduLines[i + 1].length < 40) {
        degreeLine += " in " + eduLines[i + 1];
      }
      return degreeLine;
    }
  }
  return "";
}

// A simple work experience parser (same as before).
function parseExperience(expLines) {
  const experiences = [];
  let currentExp = null;
  const dateRegex = /\d{2}\/\d{4}\s*[–—-]\s*(Present|\d{2}\/\d{4})/i;
  
  for (const line of expLines) {
    if (!line || /^[_\-]+$/.test(line)) continue;
    
    // If the line contains a date range, assume it's role/duration.
    if (dateRegex.test(line)) {
      if (currentExp) {
        const splitIndex = line.search(dateRegex);
        if (splitIndex !== -1) {
          currentExp.role = line.slice(0, splitIndex).trim();
          currentExp.duration = line.slice(splitIndex).trim().replace(/[’‘]/g, '-');
        } else {
          currentExp.role = line;
        }
      }
      continue;
    }
    
    // If the line starts with a bullet, add as description.
    if (/^[•\-\*o]/.test(line)) {
      if (currentExp) {
        const desc = line.replace(/^[•\-\*o]\s*/, '');
        currentExp.description.push(desc);
      }
      continue;
    }
    
    // Otherwise, if we already have a complete entry, push it.
    if (currentExp && currentExp.company && currentExp.role) {
      experiences.push(currentExp);
      currentExp = null;
    }
    // Start a new entry.
    currentExp = {
      company: line,
      role: "",
      duration: "",
      description: []
    };
  }
  if (currentExp && currentExp.company) experiences.push(currentExp);
  return experiences;
}

// Convert PDF pages to images using pdf2pic.
async function convertPDFToImages(pdfPath, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const options = {
    density: 300,
    saveFilename: 'page',
    savePath: outputDir,
    format: 'png',
    width: 1240,
    height: 1754,
  };
  const converter = fromPath(pdfPath, options);
  const pagesData = await converter.bulk(-1, false);
  return pagesData.map(page => page.path);
}

// Use Tesseract.js to perform OCR on an array of image files.
async function extractTextFromImages(imagePaths) {
  let fullText = '';
  for (const imagePath of imagePaths) {
    console.log(`Processing OCR for ${imagePath}...`);
    try {
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        logger: m => console.log(m.status, m.progress),
      });
      fullText += text + '\n';
    } catch (error) {
      console.error(`Error processing image ${imagePath}:`, error);
    }
  }
  return fullText;
}

/**
 * Parses the full OCR text into a structured JSON resume.
 */
function parseResumeData(text, resumePath) {
  const result = {
    name: "",
    email: "",
    resumePath: resumePath,
    degree: "",
    gpa: null,
    skills: [],
    experience: []
  };

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Use the very first non-empty line as the candidate's name.
  if (lines.length > 0) {
    result.name = lines[0].replace(/\s+[a-zA-Z]$/, '');
  }
  
  // Extract email from the entire text.
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) {
    result.email = emailMatch[0];
  }
  
  // For degree, try to find an EDUCATION section.
  const eduSection = extractSection(text, ["EDUCATION"]);
  if (eduSection.length > 0) {
    result.degree = parseEducation(eduSection);
  }
  
  // GPA extraction.
  const gpaRegex = /GPA[:\s]+([0-4]\.\d+)/i;
  const gpaMatch = text.match(gpaRegex);
  if (gpaMatch) {
    result.gpa = parseFloat(gpaMatch[1]);
  }
  
  // Extract SKILLS section by using header keywords.
  const skillsSection = extractSection(text, [
    "SKILLS",
    "SKILL",
    "TECHNICAL SKILLS",
    "HARD SKILLS",
    "SOFT SKILLS",
    "TOOLS & SOFTWARE",
    "PROGRAMMING LANGUAGES"
  ]);
  result.skills = parseSkills(skillsSection);
  
  // For experience, try to extract the WORK EXPERIENCE section.
  const workSection = extractSection(text, ["WORK EXPERIENCE"]);
  if (workSection.length > 0) {
    result.experience = parseExperience(workSection);
  }
  
  return result;
}

// Main function to process the resume PDF.
async function processResume(pdfPath) {
  const outputDir = path.join(__dirname, 'temp_images');
  console.log('Converting PDF to images...');
  const imagePaths = await convertPDFToImages(pdfPath, outputDir);
  
  console.log('Extracting text from images using OCR...');
  const extractedText = await extractTextFromImages(imagePaths);
  
  console.log('Parsing resume data...');
  const resumeData = parseResumeData(extractedText, pdfPath);
  
  console.log('Final extracted JSON:');
  console.log(JSON.stringify(resumeData, null, 2));
  
  // Optionally, remove temporary images:
  // fs.rmSync(outputDir, { recursive: true, force: true });
}

// Testing the resume parser with the provided file path.
const pdfPath = './src/uploads/resumes/sample_cv_first.pdf';
console.log("Testing resume parser with file:", pdfPath);
processResume(pdfPath);
