import fs from 'fs';
import pdfParse from 'pdf-parse';

/**
 * Enhances formatting by:
 * • Inserting a space after a comma if missing.
 * • Inserting a space between an uppercase abbreviation and a month (case-insensitive).
 * • Inserting spaces between letters and digits if needed.
 * • Normalizing multiple spaces.
 * • Removing bullet markers at the start of lines.
 * • Replacing newline characters with a space.
 * @param {string} text 
 * @returns {string} Enhanced text.
 */
function enhanceText(text) {
  let result = text;
  // Ensure a space follows a comma if missing.
  result = result.replace(/,(\S)/g, ', $1');
  // Insert space between an uppercase abbreviation and a month name.
  result = result.replace(/([A-Z]{2,})(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi, '$1 $2');
  // Insert space between a letter and a digit, and digit followed by a letter.
  result = result.replace(/([A-Za-z])(\d)/g, '$1 $2');
  result = result.replace(/(\d)([A-Za-z])/g, '$1 $2');
  // Remove bullet markers at the beginning of lines (●, •, or -).
  result = result.replace(/^[●•-]+\s*/gm, '');
  // Replace newline characters with a space.
  result = result.replace(/\n/g, ' ');
  // Normalize multiple spaces.
  result = result.replace(/\s{2,}/g, ' ');
  return result.trim();
}

/**
 * Combines an array of name fragments intelligently.
 * If a fragment is a single letter, it appends with no space;
 * otherwise, it inserts a space between fragments.
 * For example, ["F", "IRST", "L", "AST"] becomes "FIRST LAST".
 * @param {string[]} fragments 
 * @returns {string} Combined name.
 */
function combineNameFragments(fragments) {
  let result = '';
  for (let i = 0; i < fragments.length; i++) {
    const frag = fragments[i];
    if (i === 0) {
      result = frag;
    } else {
      // If the previous fragment was a single letter, append without space.
      if (fragments[i - 1].length === 1) {
        result += frag;
      } else {
        result += ' ' + frag;
      }
    }
  }
  return result;
}

/**
 * Extracts the candidate's name from the raw text.
 * New approach:
 * 1. Split the text into non-empty lines.
 * 2. If the first line is very short (e.g. less than 10 characters) and consists solely of letters,
 *    then continue collecting subsequent lines that are also short and alphabetic.
 *    Combine these fragments using combineNameFragments().
 * 3. Otherwise, simply return the first non-empty line.
 * (Additional strategies like "line before email" can be added as fallback if needed.)
 * @param {string} text 
 * @returns {string} The candidate's name.
 */
function extractNameFromText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return '';
  const threshold = 10;
  if (lines[0].length < threshold && /^[A-Za-z.]+$/.test(lines[0])) {
    let fragments = [lines[0]];
    let i = 1;
    while (i < lines.length && lines[i].length < threshold && /^[A-Za-z.]+$/.test(lines[i])) {
      fragments.push(lines[i]);
      i++;
    }
    return combineNameFragments(fragments);
  }
  return lines[0];
}

/**
 * Splits the skills text into an array of individual skills.
 * @param {string} skillsText 
 * @returns {string[]} Array of skills.
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
 * Parses the raw experience section text into a structured array of experience objects.
 * Assumes each experience entry is separated by one or more blank lines.
 * Each entry should have:
 *  - First line: Company (and location)
 *  - Second line: Role and Duration (separated by a delimiter like "-" or "|")
 *  - Subsequent lines: Description bullet points.
 * @param {string} experienceText 
 * @returns {Array} Array of structured experience objects.
 */
function parseExperience(experienceText) {
  const experienceEntries = [];
  // Split entries by one or more blank lines.
  const rawEntries = experienceText.split(/\n\s*\n/);

  for (const entry of rawEntries) {
    // Split entry into non-empty lines.
    const lines = entry.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    // Initialize default values.
    let company = '';
    let role = '';
    let duration = '';
    let description = [];

    // Assume the first line is the company (and location).
    company = lines[0];

    // If a second line exists, try to extract role and duration.
    if (lines.length > 1) {
      // Try splitting on a common delimiter (adjust regex as needed).
      const parts = lines[1].split(/[-|]/).map(p => p.trim());
      if (parts.length >= 2) {
        role = parts[0];
        duration = parts[1];
      } else {
        // Fallback if delimiter not found.
        role = lines[1];
      }
    }

    // The rest of the lines (if any) are the description.
    if (lines.length > 2) {
      // Optionally, further split each description line by bullet markers.
      for (let i = 2; i < lines.length; i++) {
        // Split on common bullet markers if present, else use the full line.
        const bullets = lines[i].split(/[●•]/).map(s => s.trim()).filter(s => s.length > 0);
        if (bullets.length > 1) {
          description.push(...bullets);
        } else {
          description.push(lines[i]);
        }
      }
    }

    experienceEntries.push({ company, role, duration, description });
  }
  return experienceEntries;
}

/**
 * Splits the resume text into sections based on known headers.
 * Lines that are only separators (underscores/dashes) are filtered out.
 * Lines are joined with "\n" (to preserve bullet points and natural breaks) and then enhanced.
 * @param {string} text 
 * @returns {Object} An object mapping header names to their content.
 */
function extractSections(text) {
  const KNOWN_HEADERS = new Set([
    "CONTACT", "EDUCATION", "EXPERIENCE", "WORK EXPERIENCE",
    "PROFESSIONAL EXPERIENCE", "SKILLS", "PROJECTS",
    "VOLUNTEERING ACTIVITIES AND EXTRACURRICULARS", "OTHER"
  ]);
  const lines = text.split('\n').map(line => line.trim());
  const sections = {};
  let currentHeader = 'PROFILE';
  sections[currentHeader] = [];
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (KNOWN_HEADERS.has(upper)) {
      currentHeader = upper;
      sections[currentHeader] = [];
    } else {
      // Skip lines that are just separators.
      if (line && !/^[_\s-]+$/.test(line)) {
        sections[currentHeader].push(line);
      }
    }
  }
  // Join each section’s lines with newlines and enhance them.
  for (const header in sections) {
    const joined = sections[header].join('\n');
    sections[header] = enhanceText(joined);
  }
  return sections;
}

/**
 * Extracts structured resume data from the raw PDF text.
 * Retrieves email, phone, candidate name, education, and work experience.
 * Now also extracts SKILLS.
 * @param {string} text 
 * @returns {Object} Structured resume data.
 */
function extractResumeData(text) {
  const resumeData = {};

  // Extract email.
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) {
    resumeData.email = emailMatch[0];
  }

  // Extract phone.
  const phoneMatch = text.match(/(\+?\d{1,2}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4})/);
  if (phoneMatch) {
    resumeData.phone = phoneMatch[0];
  } 

  // Extract candidate name using our updated strategy.
  resumeData.name = extractNameFromText(text);

  // Extract sections.
  const sections = extractSections(text);
  resumeData.education = sections["EDUCATION"] || '';

  // Extract GPA
  const gpaMatch = text.match(/GPA\s*[:\-]?\s*([0-9]\.[0-9]+)/i);
  resumeData.gpa = gpaMatch ? parseFloat(gpaMatch[1]) : null;
  
  // New: Extract skills.
  resumeData.skills = sections["SKILLS"] ? parseSkills(sections["SKILLS"]) : [];

  // Prioritize WORK EXPERIENCE, then PROFESSIONAL EXPERIENCE, then EXPERIENCE.
  if (sections["WORK EXPERIENCE"]) {
    resumeData.experience = sections["WORK EXPERIENCE"];
  } else if (sections["PROFESSIONAL EXPERIENCE"]) {
    resumeData.experience = sections["PROFESSIONAL EXPERIENCE"];
  } else if (sections["EXPERIENCE"]) {
    resumeData.experience = sections["EXPERIENCE"];
  } else {
    resumeData.experience = '';
  }

  return resumeData;
}

/**
 * Parses a PDF file (resume) and extracts its structured data.
 * @param {string} filePath - The path to the resume PDF.
 */
async function parseResumePdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    const resumeData = extractResumeData(text);
    
    console.log('Extracted Resume Data:', resumeData);
    return [resumeData];
  } catch (error) {
    console.error('Error reading or parsing the PDF file:', error);
  }
}

// Remove example usage below so this module only exports the parsing function
// const filePath1 = './src/uploads/resumes/sample_cv_first.pdf';
// parseResumePdf(filePath1);

// export default { parseResumePdf };

// Example usage:
// const filePath1 = './src/uploads/resumes/sample_cv_first.pdf'; // Replace with the actual file path
// parseResumePdf(filePath1);

const filePath2 = './src/uploads/resumes/sample_cv_second.pdf'; // Replace with the actual file path
parseResumePdf(filePath2);

// const filePath3 = './src/uploads/resumes/sample_cv_third.pdf'; // Replace with the actual file path
// parseResumePdf(filePath3);

// const filePath4 = './src/uploads/resumes/sample_cv_fourth.pdf'; // Replace with the actual file path
// parseResumePdf(filePath4);
