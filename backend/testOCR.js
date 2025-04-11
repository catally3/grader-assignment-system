import tesseract from "node-tesseract-ocr";
import { fromPath } from "pdf2pic";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Enable debug logging.
const DEBUG = true;
function logDebug(message, ...args) {
  if (DEBUG) console.log("[DEBUG]", message, ...args);
}

// For ES modules, define __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Normalize OCR text by merging broken lines.
 * Avoid merging if the next line starts with a bullet marker or misrecognized bullet.
 */
function normalizeText(text) {
  logDebug("Starting normalization of text.");
  const rawLines = text.split("\n").map(line => line.trim());
  let normalizedLines = [];
  for (let i = 0; i < rawLines.length; i++) {
    if (!rawLines[i]) continue;
    if (
      i < rawLines.length - 1 &&
      rawLines[i] &&
      !/[.!?]$/.test(rawLines[i]) &&
      !/^(?:[•●\-+]|e\s)/i.test(rawLines[i + 1]) &&
      /^[a-z]/.test(rawLines[i + 1])
    ) {
      rawLines[i + 1] = rawLines[i] + " " + rawLines[i + 1];
    } else {
      normalizedLines.push(rawLines[i]);
    }
  }
  const normalizedText = normalizedLines.join("\n");
  logDebug("Normalized text:\n", normalizedText);
  return normalizedText;
}

/**
 * Convert a PDF to text using pdf2pic and Tesseract OCR.
 */
async function convertPdfToText(pdfPath) {
  logDebug("Converting PDF to text for:", pdfPath);
  const converter = fromPath(pdfPath, {
    density: 300,
    saveFilename: "temp",
    savePath: path.join(__dirname, "temp_images"),
    format: "png",
    width: 1240,
    height: 1754,
  });
  const totalPages = 1; // adjust for multi-page PDFs if needed
  let fullText = "";
  const tempDir = path.join(__dirname, "temp_images");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    logDebug("Created temporary directory:", tempDir);
  }
  for (let page = 1; page <= totalPages; page++) {
    const imageResponse = await converter(page);
    const imagePath = imageResponse.path;
    logDebug(`Processing page ${page} with image ${imagePath}`);
    const text = await tesseract.recognize(imagePath, {
      lang: "eng",
      oem: 1,
      psm: 3,
    });
    logDebug(`OCR text from page ${page}:`, text);
    fullText += text + "\n";
    fs.unlinkSync(imagePath);
    logDebug("Deleted temporary image:", imagePath);
  }
  return fullText;
}

/**
 * Parse candidate name assuming it’s the first non-empty line.
 */
function parseName(lines) {
  const name = lines[0] || "";
  logDebug("Parsed name:", name);
  return name;
}

/**
 * Extract an email address using a regex.
 */
function parseEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";
  logDebug("Parsed email:", email);
  return email;
}

/**
 * Parse the EDUCATION section to extract the degree.
 */
function parseEducation(text) {
  const eduRegex = /EDUCATION([\s\S]*?)(?=(VOLUNTEERING ACTIVITIES|PROJECTS|CONTACT|SKILLS|$))/i;
  const match = text.match(eduRegex);
  let degree = "";
  if (match) {
    const eduSection = match[1];
    const lines = eduSection.split("\n")
      .map(line => line.trim())
      .filter(line => line && !/^_+$/.test(line));
    logDebug("Education section lines:", lines);
    for (let i = 0; i < lines.length; i++) {
      if (/^(Bachelor|Master)/i.test(lines[i])) {
        degree = lines[i];
        if (i + 1 < lines.length && !/(University|,|–|\d{2}\/\d{4})/i.test(lines[i + 1])) {
          degree += " in " + lines[i + 1];
        }
        break;
      }
    }
  }
  logDebug("Parsed degree:", degree);
  return degree;
}

/**
 * Extract GPA from the text, if available.
 */
function parseGPA(text) {
  const gpaRegex = /GPA[:\s]*([0-4]\.\d{1,2})/i;
  const match = text.match(gpaRegex);
  const gpa = match ? parseFloat(match[1]) : null;
  logDebug("Parsed GPA:", gpa);
  return gpa;
}

/**
 * Extract skills from the SKILLS section.
 */
function parseSkills(text) {
  const lines = text.split("\n").map(line => line.trim());
  const startIdx = lines.findIndex(l => /skills/i.test(l));
  if (startIdx < 0) return [];
  let skills = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^(VOLUNTEERING ACTIVITIES.*|PROJECTS.*|CONTACT.*|EDUCATION.*|OTHER.*)$/i.test(lines[i])) break;
    if (/^_+$/.test(lines[i])) continue;
    if (/^(?:[•●\-+]|e\s)/i.test(lines[i])) {
      let skill = lines[i].replace(/^(?:[•●\-+]|e\s)/i, "").trim();
      if (skill.toLowerCase().includes("don't forget")) continue;
      skills.push(skill);
    }
  }
  logDebug("Parsed skills:", skills);
  return skills;
}

/**
 * A simple template classifier.
 */
function detectTemplate(text) {
  if (/professional experience/i.test(text)) return "formatB";
  if (/react developer/i.test(text) && /bismarck/i.test(text)) return "formatB";
  return "formatA";
}

/**
 * Parse experience for formatA resumes.
 */
function parseExperienceFormatA(expLines) {
  let experiences = [];
  const bulletRegex = /^(?:[•●\-+]|e\s)/i;
  const dateRegex = /\d{2}\/\d{4}\s*[\u2013\u2014-]\s*(Present|\d{2}\/\d{4})/;
  const headerRegex = /^(.*?)(\d{2}\/\d{4}\s*[\u2013\u2014-]\s*(Present|\d{2}\/\d{4}))(?:\s*(?:[•●\-+]|e\s+)?(.*))?$/;
  
  let i = 0;
  while (i < expLines.length - 1) {
    if (!bulletRegex.test(expLines[i]) && dateRegex.test(expLines[i + 1])) {
      const company = expLines[i];
      const header = expLines[i + 1];
      const headerMatch = header.match(headerRegex);
      if (headerMatch) {
        const role = headerMatch[1].trim();
        const duration = headerMatch[2].trim();
        let description = [];
        if (headerMatch[4]) description.push(headerMatch[4].trim());
        i += 2;
        while (i < expLines.length) {
          if (!bulletRegex.test(expLines[i]) && (i + 1 < expLines.length && dateRegex.test(expLines[i + 1]))) break;
          if (bulletRegex.test(expLines[i])) {
            description.push(expLines[i].replace(bulletRegex, "").trim());
            i++;
          } else if (description.length > 0) {
            description[description.length - 1] += " " + expLines[i];
            i++;
          } else break;
        }
        experiences.push({ company, role, duration, description, matchedSkills: [] });
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  return experiences;
}

/**
 * Parse experience for formatB resumes.
 * This version looks ahead up to 5 lines after the header to pick a role candidate using keyword matching.
 */
function parseExperienceFormatB(expLines) {
  let experiences = [];
  const dateRegex = /\d{2}\/\d{4}\s*[\u2013\u2014-]\s*(Present|\d{2}\/\d{4})/;
  const headerRegex = /^(.*?)(\d{2}\/\d{4}\s*[\u2013\u2014-]\s*(Present|\d{2}\/\d{4}))(.*)$/;
  const bulletRegex = /^(?:[•●\-+@©]|e\s)/i;
  
  let i = 0;
  while (i < expLines.length) {
    if (dateRegex.test(expLines[i])) {
      let headerMatch = expLines[i].match(headerRegex);
      if (headerMatch) {
        let company = headerMatch[1].trim();
        let duration = headerMatch[2].trim();
        let extraInfo = headerMatch[4] ? headerMatch[4].trim() : "";
        i++;
        // Look ahead up to 5 lines for candidate roles.
        let candidates = [];
        const jobTitleKeywords = ["developer", "engineer", "designer", "manager", "analyst", "programmer", "consultant", "support"];
        for (let j = 0; j < 5 && i < expLines.length; j++, i++) {
          if (!bulletRegex.test(expLines[i])) {
            let candidate = expLines[i].trim();
            if (candidate.length < 100 && jobTitleKeywords.some(k => candidate.toLowerCase().includes(k))) {
              candidates.push(candidate);
            }
          }
        }
        let role = "";
        if (candidates.length > 0) {
          role = candidates.reduce((a, b) => a.length <= b.length ? a : b, candidates[0]);
        }
        let description = [];
        if (extraInfo) description.push(extraInfo);
        while (i < expLines.length) {
          if (dateRegex.test(expLines[i])) break;
          if (bulletRegex.test(expLines[i])) {
            description.push(expLines[i].replace(bulletRegex, "").trim());
          } else if (description.length > 0 && expLines[i].length < 200) {
            description[description.length - 1] += " " + expLines[i];
          }
          i++;
        }
        experiences.push({ company, role, duration, description, matchedSkills: [] });
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  return experiences;
}

/**
 * Parse the experience section.
 */
function parseExperience(text) {
  const normalized = normalizeText(text);
  let lines = normalized.split("\n").map(l => l.trim()).filter(l => l);
  
  // Locate the experience section (accept both WORK and PROFESSIONAL EXPERIENCE).
  let startIdx = lines.findIndex(l => /(?:work|professional) experience/i.test(l));
  if (startIdx < 0) return [];
  lines = lines.slice(startIdx + 1);
  
  // Bound the section using known headers.
  const sectionHeaders = /^(VOLUNTEERING ACTIVITIES.*|PROJECTS.*|CONTACT.*|SKILLS.*|EDUCATION.*|OTHER.*)$/i;
  let endIdx = lines.findIndex(l => sectionHeaders.test(l));
  if (endIdx < 0) endIdx = lines.length;
  const expLines = lines.slice(0, endIdx);
  logDebug("Work Experience section lines after boundary:", expLines);
  
  const template = detectTemplate(normalized);
  logDebug("Detected template:", template);
  if (template === "formatB") {
    return parseExperienceFormatB(expLines);
  } else {
    return parseExperienceFormatA(expLines);
  }
}

/**
 * Combine all parsing functions to produce the final structured resume JSON.
 */
function parseResumeText(text, resumePath) {
  const normalizedText = normalizeText(text);
  const lines = normalizedText.split("\n").map(l => l.trim()).filter(l => l);
  const name = parseName(lines);
  const email = parseEmail(normalizedText);
  const degree = parseEducation(normalizedText);
  const gpa = parseGPA(normalizedText);
  const skills = parseSkills(normalizedText);
  const experience = parseExperience(normalizedText);
  return { name, email, resumePath, degree, gpa, skills, experience };
}

/**
 * Main function: converts PDF to OCR text then parses the resume.
 */
async function parseResume(pdfPath) {
  try {
    const ocrText = await convertPdfToText(pdfPath);
    logDebug("Full OCR Text:\n", ocrText);
    const parsedData = parseResumeText(ocrText, pdfPath);
    return parsedData;
  } catch (error) {
    console.error("Error parsing resume:", error);
    return null;
  }
}

// ----- Example Usage -----
(async () => {
  const resumePath = path.join(__dirname, "./src/uploads/resumes/sample_cv_third.pdf");
  const resumeData = await parseResume(resumePath);
  console.log("Parsed Resume Data:");
  console.log(JSON.stringify(resumeData, null, 2));
})();
