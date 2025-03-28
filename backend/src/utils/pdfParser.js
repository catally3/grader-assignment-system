import fs from 'fs';
import pdfParse from 'pdf-parse';

/**
 * Enhances formatting by:
 * • Inserting a space after a comma if missing.
 * • Inserting a space between an uppercase abbreviation and a month (case-insensitive).
 * • Inserting spaces between letters and digits if needed.
 * • Normalizing multiple spaces.
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
 * Matches skills against experience descriptions.
 * @param {string[]} skills - List of extracted skills.
 * @param {string[]} descriptions - Experience description bullets.
 * @returns {string[]} Matched skills found within descriptions.
 */
function matchSkills(skills, descriptions) {
  const matched = new Set();
  const descriptionText = descriptions.join(' ').toLowerCase();

  skills.forEach(skill => {
    const skillLower = skill.toLowerCase().split('(')[0].trim();
    if (descriptionText.includes(skillLower)) matched.add(skill);
  });

  return Array.from(matched);
}

/**
 * Returns a regex that matches durations like:
 * - "09/2015 – Present"
 * - "Jun 2018 – Present"
 * - "June 2010 – Dec 2014"
 */
function getDurationRegex() {
  const datePart = '(?:\\d{2}\\/\\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4})';
  return new RegExp(`${datePart}\\s*[–-]\\s*(?:Present|${datePart})`, 'i');
}

/**
 * Attempts to extract the duration substring from a header line.
 * @param {string} headerLine
 * @returns {string|null} the matched duration, or null if not found.
 */
function extractDuration(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  return match ? match[0].trim() : null;
}

/**
 * Splits a header line into two parts: the company portion and the duration.
 * @param {string} headerLine 
 * @returns {Object} Object with header and duration properties.
 */
function splitHeaderLine(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  if (match) {
    const duration = match[0].trim();
    const headerPart = headerLine.replace(durationRegex, '').trim();
    return { header: headerPart, duration };
  }
  return { header: headerLine, duration: '' };
}

/**
 * Parses the experience section into structured objects by detecting header lines
 * using duration patterns. When a header line is found, any subsequent non‐empty lines 
 * (until a new header is encountered) are combined as the role. The remaining lines are 
 * treated as the description. This version filters out any empty strings.
 * @param {string} experienceText 
 * @returns {Array} Array of structured experience objects.
 */
function parseExperience(experienceText) {
  const lines = experienceText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    // Remove common bullet markers from the beginning of lines.
    .map(line => line.replace(/^[-•●]\s*/, ''));
  
  const experiences = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const duration = extractDuration(line);
    if (duration) {
      // Start a new experience using the header line.
      const { header, duration: extractedDuration } = splitHeaderLine(line);
      let company = header;
      let roleLines = [];
      let descriptionLines = [];
      
      i++; // move to the next line to start collecting role lines
      
      // Collect role lines until a blank line, a line with a bullet, or a line that itself contains a duration.
      while (i < lines.length) {
        const nextLine = lines[i];
        if (nextLine === "" || nextLine.match(/^[-•●]/) || extractDuration(nextLine)) {
          break;
        }
        // Only add non-empty trimmed lines.
        if (nextLine.trim()) {
          roleLines.push(nextLine.trim());
        }
        i++;
      }
      const role = roleLines.join(' ').trim();
      
      // Now collect the description lines until the next header is found.
      while (i < lines.length) {
        const nextLine = lines[i];
        if (extractDuration(nextLine)) {
          break; // new header detected, stop description collection.
        }
        if (nextLine.trim()) {
          descriptionLines.push(nextLine.trim());
        }
        i++;
      }
      
      experiences.push({
        company,
        role,
        duration: extractedDuration,
        description: descriptionLines,
        matchedSkills: []  // To be populated later
      });
    } else {
      i++;
    }
  }
  return experiences;
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
    "VOLUNTEERING ACTIVITIES AND EXTRACURRICULARS", "OTHER",
    "EMPLOYMENT HISTORY"
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

  // Extract and structure experiences
  const experiences = parseExperience(sections["EMPLOYMENT HISTORY"] || 
    sections["WORK EXPERIENCE"] || 
    sections["PROFESSIONAL EXPERIENCE"] || 
    sections["EXPERIENCE"] || '');
  experiences.forEach(exp => {
  exp.matchedSkills = matchSkills(resumeData.skills, exp.description);
  });
  resumeData.experience = experiences;

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
    // Split raw text into pages using the form feed character.
    let pages = data.text.split('\f');
    
    // Process each page: split into lines and trim.
    let pagesLines = pages.map(page => 
      page.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    );
    
    // If there's only one page, skip header/footer removal.
    const threshold = pagesLines.length > 1 ? Math.ceil(pagesLines.length / 2) : Infinity;
    
    // Count how many pages each line appears in.
    let lineCount = {};
    for (const lines of pagesLines) {
      const uniqueLines = new Set(lines);
      for (const line of uniqueLines) {
        lineCount[line] = (lineCount[line] || 0) + 1;
      }
    }
    
    // Remove lines that appear in at least 'threshold' pages (likely header/footer).
    let cleanedPages = pagesLines.map(lines => 
      lines.filter(line => lineCount[line] < threshold)
    );
    
    // Combine the cleaned pages back into a single text.
    let combinedText = cleanedPages.map(lines => lines.join('\n')).join('\n');
    
    // Optionally enhance the combined text.
    const enhancedText = enhanceText(combinedText);
    
    const resumeData = extractResumeData(enhancedText);
    // console.log('Extracted Resume Data:', resumeData);
    console.log('Extracted Resume Data:', JSON.stringify(resumeData, null, 2))
    return [resumeData];
  } catch (error) {
    console.error('Error reading or parsing the PDF file:', error);
  }
}

export default { parseResumePdf };