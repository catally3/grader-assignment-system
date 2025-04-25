import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import pdfParse from 'pdf-parse';

const DEBUG = true;
function logDebug(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

/* ================================
   TEXT ENHANCEMENT FUNCTIONS
=============================================== */
function enhanceText(text) {
  let result = text;
  // Remove control characters completely.
  result = result.replace(/\u0000/g, "");
  // Normalize curly quotes.
  result = result.replace(/[“”]/g, '"');
  // Ensure a space follows a comma.
  result = result.replace(/,(\S)/g, ', $1');
  // Insert space between uppercase abbreviation and a month.
  result = result.replace(/([A-Z]{2,})(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi, '$1 $2');
  // Insert space between letters and digits.
  result = result.replace(/([A-Za-z])(\d)/g, '$1 $2');
  result = result.replace(/(\d)([A-Za-z])/g, '$1 $2');
  // Normalize multiple spaces.
  result = result.replace(/\s{2,}/g, ' ');
  // --- Normalize corrupted variants of "Software" and "Microsoft"
  result = result.replace(/So[\s\x00]*ware/gi, "Software");
  result = result.replace(/Microso[\s\x00]*/gi, "Microsoft");
  return result.trim();
}

/* ================================
   CANDIDATE DETAILS EXTRACTION FROM FILE NAME
   (NEW FUNCTIONALITY)
=============================================== */
/**
 * Extract candidate details from file name assuming the pattern:
 * FirstName_LastName_ApplicantID.pdf
 * - If there are more than three parts, the first part is the first name,
 *   the last part is the applicant ID, and any middle parts comprise the last name.
 *
 * @param {string} fileName - The original file name.
 * @returns {object|null} - An object with firstName, lastName, applicantId, and combined name, or null if extraction fails.
 */
function extractCandidateDetailsFromFileName(fileName) {
  // Remove extension
  const baseName = path.basename(fileName, path.extname(fileName));
  // Split the file name by underscores
  const parts = baseName.split('_');
  if (parts.length >= 3) {
    const firstName = parts[0];
    const applicantId = parts[parts.length - 1];
    // Filter out any part equal to "resume" (case-insensitive)
    const lastNameParts = parts.slice(1, parts.length - 1).filter(part => part.toLowerCase() !== "resume");
    const lastName = lastNameParts.join(' ');
    return { firstName, lastName, applicantId, name: `${firstName} ${lastName}` };
  }
  return null;
}

/* ================================
   NAME EXTRACTION
=============================================== */
function combineNameFragments(fragments) {
  let result = '';
  for (let i = 0; i < fragments.length; i++) {
    const frag = fragments[i];
    if (i === 0) {
      result = frag;
    } else {
      result += fragments[i - 1].length === 1 ? frag : ' ' + frag;
    }
  }
  return result;
}

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

/* ================================
   SKILLS EXTRACTION
=============================================== */
function parseSkills(skillsText) {
  const cleanText = skillsText.replace(/\n/g, ' ');
  const cleanedText = cleanText.replace(/(Hard Skills:|Programming Languages:|Tools and Software:|don’t forget.*)/gi, '');
  const rawSkills = cleanedText.split(/[●•,]/);
  const unwantedPrefixes = [
    "Hard Skill:", "Hard Skills:", "Programming Languages:",
    "Tools and Software:", "Soft Skills:", "Soft Skill:",
    "Technical Skills:", "Technical Skill:", "Technical Skills", "Industry Knowledge", "Docker Products", "Tools & Software"
  ];
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
    .filter(s => s.length > 0 && s.length <= 50);
  return Array.from(new Set(skills));
}

/* ================================
   SKILL MATCHING
=============================================== */
function matchSkills(skills, descriptions) {
  const matched = new Set();
  const descriptionText = descriptions.join(' ').toLowerCase();
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase().split('(')[0].trim();
    if (descriptionText.includes(skillLower)) matched.add(skill);
  });
  return Array.from(matched);
}

function extractAdditionalSkillsFromDescription(descriptionLines) {
  const additional = new Set();
  descriptionLines.forEach(line => {
    const regex = /(?:Databases:|Software:|Languages:)(.+?)(?:\.|$)/gi;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const skillsText = match[1];
      skillsText.split(/,| and /).forEach(skill => {
        const s = skill.trim();
        if (s.length > 0) {
          additional.add(s);
        }
      });
    }
  });
  return Array.from(additional);
}

/* ================================
   DURATION & HEADER PARSING
=============================================== */
// ================================
//   DURATION & HEADER PARSING (GENERALIZED)
// ================================
function getDurationRegex() {
  // • MM/YYYY or Month YYYY
  const monthDate  =
    '(?:\\d{2}\\/\\d{4}' +
    '|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?' +
    '|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4})';
  // • Month‑range or MM/YYYY‑range (to Present or another date)
  const monthRange = `${monthDate}\\s*[–-]\\s*(?:Present|${monthDate})`;
  // • Simple YYYY–YYYY range
  const yearRange  = '\\d{4}\\s*[–-]\\s*\\d{4}';
  // build one regex that matches any of them
  return new RegExp(`(?:${monthRange}|${yearRange})`, 'i');
}

function extractDuration(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  const result = match ? match[0].trim() : null;
  // logDebug("extractDuration:", headerLine, "->", result);
  return result;
}

function splitHeaderLine(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  if (match) {
    const duration = match[0].trim();
    // remove the matched text plus any leftover parens
    let header = headerLine
      .replace(durationRegex, '')
      .replace(/\(\s*\)/g, '')    // empty ()
      .replace(/[()]/g, '')       // stray parens
      .trim();
    return { header, duration };
  }
  return { header: headerLine, duration: '' };
}

/* ================================
   EXPERIENCE EXTRACTION
=============================================== */
function parseExperience(experienceText) {
  // split out lines and strip bullets
  const lines = experienceText
    .split('\n')
    .map(l => l.trim().replace(/^[-•●]\s*/, ''))
    .filter(l => l);

  const experiences = [];
  const jobTitleKeywords = [
    "developer","engineer","tester","manager",
    "analyst","programmer","consultant",
    "support","designer"
  ];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const { header, duration } = splitHeaderLine(line);

    if (duration) {
      // defaults
      let company = header;
      let role    = "";

      // 1) “X at Y”
      const atMatch = header.match(/(.+?)\s+at\s+(.+)/i);
      if (atMatch) {
        role    = atMatch[1].trim();
        company = atMatch[2].trim();
      }
      // 2) “Company, …” above & header is just the role
      else if (i > 0 && /,/.test(lines[i - 1]) && !/,/.test(header)) {
        company = lines[i - 1].trim();
        role    = header;
      }
      // 3) fallback: scan next lines for a title keyword
      if (!role) {
        const candidates = [];
        for (let j = 1; j <= 5 && i + j < lines.length; j++) {
          const nxt = lines[i + j];
          if (splitHeaderLine(nxt).duration) break;
          if (
            nxt.length < 100 &&
            jobTitleKeywords.some(k => nxt.toLowerCase().includes(k))
          ) {
            candidates.push(nxt);
          }
        }
        if (candidates.length) {
          role = candidates.reduce((a,b) => a.length <= b.length ? a : b);
        }
      }

      // advance past header + any role‑candidate lines
      i += 1;
      if (!role && i < lines.length && splitHeaderLine(lines[i]).duration === '') {
        // no extra skip
      } else {
        // if we picked up candidates, skip them
        i += (role ? 0 : 0);
      }

      // collect description until next duration
      let desc = "";
      while (i < lines.length && !getDurationRegex().test(lines[i])) {
        desc += (desc ? " " : "") + lines[i++];
      }
      // break into bullets
      let description = [];
      if (desc.trim()) {
        description = desc
          .split(/\.\s+(?=["']?\s*[A-Z])/)
          .map(s => s.trim())
          .map(s => s.endsWith('.') ? s : s + '.')
          .filter(Boolean);
        // drop a bullet that is just the role
        if (
          role &&
          description[0] &&
          description[0].toLowerCase().startsWith(role.toLowerCase())
        ) {
          description.shift();
        }
      }

      experiences.push({
        company,
        role,
        duration,
        description,
        matchedSkills: []
      });
    } else {
      i++;
    }
  }

  return experiences;
}

/* ================================
   SECTION EXTRACTION
=============================================== */
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
      if (!sections[currentHeader]) {
        sections[currentHeader] = [];
      }
    } else {
      if (line && !/^[_\s-]+$/.test(line)) {
        sections[currentHeader].push(line);
      }
    }
  }
  for (const header in sections) {
    const joined = sections[header].join('\n');
    sections[header] = enhanceText(joined);
  }
  return sections;
}

/* ================================
   NOISE FILTER FOR EXPERIENCE
=============================================== */
function filterExperienceNoise(text) {
  return text.split('\n')
    .filter(line => {
      return !/(?:@|\d{3}[-.\s]\d{3}[-.\s]\d{3,4}|Ave|St\s)/i.test(line);
    })
    .join('\n');
}

/* ================================
   RESUME DATA EXTRACTION
=============================================== */
function extractResumeData(text) {
  const resumeData = {};
  
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) resumeData.email = emailMatch[0];
  
  const phoneMatch = text.match(/(\+?\d{1,2}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4})/);
  if (phoneMatch) resumeData.phone = phoneMatch[0];
  
  // Even though we extract the candidate name from the resume text,
  // this field may be overwritten by the file name data below.
  resumeData.name = extractNameFromText(text);
  
  const sections = extractSections(text);
  resumeData.education = sections["EDUCATION"] || '';
  
  const gpaMatch = text.match(/GPA\s*[:\-]?\s*([0-9]\.[0-9]+)/i);
  resumeData.gpa = gpaMatch ? parseFloat(gpaMatch[1]) : null;
  
  resumeData.skills = sections["SKILLS"] ? parseSkills(sections["SKILLS"]) : [];
  
  let expText = sections["EMPLOYMENT HISTORY"] || 
                sections["EXPERIENCE"] ||
                sections["WORK EXPERIENCE"] || 
                sections["PROFESSIONAL EXPERIENCE"] || '';
  if (parseExperience(expText).length === 0) {
    expText = filterExperienceNoise(sections["PROFILE"] || '');
    const profileLines = expText.split('\n');
    if (profileLines.length > 3) {
      expText = profileLines.slice(2).join('\n');
    }
  }
  
  const experiences = parseExperience(expText);
  experiences.forEach(exp => {
    const fromSection = matchSkills(resumeData.skills, exp.description);
    const additional = extractAdditionalSkillsFromDescription(exp.description);
    exp.matchedSkills = Array.from(new Set([...fromSection, ...additional]));
  });
  resumeData.experience = experiences;
  
  return resumeData;
}

/* ================================
   PAGE CLEANING FUNCTIONS
=============================================== */
function extractHeaderFooterCandidates(pageLines, numLines = 3) {
  const candidates = [];
  if (pageLines.length >= numLines) {
    candidates.push(...pageLines.slice(0, numLines));
    candidates.push(...pageLines.slice(-numLines));
  }
  return candidates;
}

function buildCandidateFrequency(pagesLines, numLines = 3) {
  const frequency = {};
  pagesLines.forEach(lines => {
    const candidates = extractHeaderFooterCandidates(lines, numLines);
    candidates.forEach(line => {
      frequency[line] = (frequency[line] || 0) + 1;
    });
  });
  return frequency;
}

function cleanPage(lines, frequency, totalPages, thresholdFraction = 0.8, numLines = 3) {
  const threshold = totalPages * thresholdFraction;
  const headerCandidates = new Set(
    extractHeaderFooterCandidates(lines, numLines).filter(line => frequency[line] >= threshold)
  );
  return lines.filter(line => !headerCandidates.has(line));
}

/* ================================
   PDF PARSING FUNCTION
=============================================== */
async function parseResumePdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const pages = data.text.split('\f');
    let combinedText = '';
    if (pages.length === 1) {
      combinedText = pages[0];
    } else {
      const pagesLines = pages.map(page =>
        page.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      );
      const candidateFrequency = buildCandidateFrequency(pagesLines, 3);
      const cleanedPages = pagesLines.map(lines =>
        cleanPage(lines, candidateFrequency, pagesLines.length, 0.8, 3)
      );
      combinedText = cleanedPages.map(lines => lines.join('\n')).join('\n');
    }
    const enhancedText = enhanceText(combinedText);
    // logDebug("Enhanced combined text:", enhancedText);
    const resumeData = extractResumeData(enhancedText);
    // console.log('Extracted Resume Data:', JSON.stringify(resumeData, null, 2));
    return [resumeData];
  } catch (error) {
    console.error('Error reading or parsing the PDF file:', error);
  }
}

// Helper to clear a directory
function clearDirectory(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      fs.unlinkSync(path.join(dir, file));
    });
  }
}

/**
 * Turn generic parsed data into an Applicant record.
 * Any field that you don’t set here will use the defaultValue
 * defined in applicant.js.
 */
function mapToApplicant(rawData, details = {}, filePath) {
  const rec = {
    // ALWAYS include these
    applicant_name:  rawData.name,
    applicant_email: rawData.email,
    gpa:             rawData.gpa,
    resume_path:     filePath,

    // JSON fields
    skills:          rawData.skills,
    experience:      rawData.experience
  };

  // only include candidate_id if we actually parsed one:
  if (details.applicantId) {
    rec.candidate_id = details.applicantId;
  }
  // DO NOT set rec.net_id or rec.semester here:
  //   omitting them lets Sequelize use the defaultValue ("xxx000000", "Semester")

  // If you have any of these from parsing, include them.
  // Otherwise omit them to pick up defaults:
  // rec.school_year     = rawData.schoolYear;
  // rec.university      = rawData.university;
  // rec.school          = rawData.school;
  // rec.graduation_date = rawData.graduationDate;
  // rec.major           = rawData.major;
  // rec.qualified       = rawData.qualifiedFlag;

  return rec;
}

/**
 * NEW FUNCTION: Parses a ZIP file containing multiple individual resume PDFs.
 * - Clears the temporary folder first.
 * - Extracts the ZIP file to the temporary folder.
 * - For each PDF file, calls parseResumePdf().
 * - Additionally, extracts the candidate's first name, last name, and applicant ID from the file name.
 * - Renames each PDF file to a consistent short format.
 * - Returns an array of candidate objects.
 * @param {string} zipFilePath - Path to the uploaded ZIP file.
 * @returns {Promise<Array>} Array of candidate objects.
 */
async function parseZipResumes(zipFilePath) {
  try {
    const tempDir = './temp_resumes';

    // 1) Ensure or clear the temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    } else {
      clearDirectory(tempDir);
    }

    // 2) Unzip all PDFs into tempDir
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(tempDir, true);

    // 3) Read every file and process
    const files = fs.readdirSync(tempDir);
    const allApplicants = [];

    for (const file of files) {
      if (path.extname(file).toLowerCase() !== '.pdf') continue;
      const filePath = path.join(tempDir, file);

      // 3a) File name details (FirstName, LastName, applicantId)
      const details = extractCandidateDetailsFromFileName(file) || {};

      // 3b) Parse the PDF into generic rawData
      const [rawData] = await parseResumePdf(filePath);

      // 3c) Map into your Applicant model shape
      const applicant = mapToApplicant(rawData, details, filePath);
      allApplicants.push(applicant);

      // 3d) (Optional) Rename file to First_Last_ID.pdf
      if (details.firstName && details.lastName && details.applicantId) {
        const newFileName = `${details.firstName}_${details.lastName}_${details.applicantId}.pdf`;
        const newFilePath = path.join(tempDir, newFileName);
        if (!fs.existsSync(newFilePath)) {
          fs.renameSync(filePath, newFilePath);
        }
      }
    }

    // 4) Return array ready for Candidate.bulkCreate(...)
    return allApplicants;

  } catch (error) {
    console.error('Error parsing ZIP resumes:', error);
    throw error;
  }
}

export default { parseResumePdf, parseZipResumes };

/* ================================
   SAMPLE USAGE / TEST CODE
=============================================== */
// if (process.argv[1] === new URL(import.meta.url).pathname) {
//   (async () => {
//     try {
//       const filePath = './src/uploads/resumes/sample_cv_first.pdf'; // or sample_cv_second.pdf, etc.
//       if (!fs.existsSync(filePath)) {
//         console.log(`Sample resume file not found at path: ${filePath}`);
//         process.exit(1);
//       }
//       console.log(`Parsing resume from file: ${filePath}`);
//       const resumeDataArray = await parseResumePdf(filePath);
//       console.log('Parsed Resume Data:', JSON.stringify(resumeDataArray, null, 2));
//     } catch (err) {
//       console.error('Error during test usage:', err);
//     }
//   })();
// }

// // This block allows you to run this script directly (using Node) for testing purposes.
if (process.argv[1] === new URL(import.meta.url).pathname) {
  (async () => {
    try {
      const zipPath = './src/uploads/others/resumes.zip'; 
      if (!fs.existsSync(zipPath)) {
        console.error(`Test ZIP file not found at path: ${zipPath}`);
        process.exit(1);
      }

      console.log(`\nParsing resumes from ZIP file: ${zipPath}\n`);
      const applicants = await parseZipResumes(zipPath);

      console.log('Parsed Applicant Records:\n');
      applicants.forEach((app, idx) => {
        console.log(`--- Applicant #${idx + 1} ---`);
        console.log(JSON.stringify(app, null, 2));
        console.log();
      });
    } catch (err) {
      console.error('Error during test usage:', err);
    }
  })();
}

// if (process.argv[1] === new URL(import.meta.url).pathname) {
//   (async () => {
//     try {
//       const zipPath = './src/uploads/others/documents20250326-22-r5fg10.zip'; // Ensure you have a test ZIP file with PDFs in this directory.
//       if (!fs.existsSync(zipPath)) {
//         console.log(`Test ZIP file not found at path: ${zipPath}`);
//         process.exit(1);
//       }
//       console.log(`Parsing resumes from ZIP file: ${zipPath}`);
//       const candidates = await parseZipResumes(zipPath);
//       console.log('Parsed Candidate Data:', JSON.stringify(candidates, null, 2));
//     } catch (err) {
//       console.error('Error during test usage:', err);
//     }
//   })();
// }