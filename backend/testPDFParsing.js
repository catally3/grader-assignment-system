import fs from 'fs';
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
function getDurationRegex() {
  const datePart = '(?:\\d{2}\\/\\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4})';
  return new RegExp(`${datePart}\\s*[–-]\\s*(?:Present|${datePart})`, 'i');
}

function extractDuration(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  const result = match ? match[0].trim() : null;
  logDebug("extractDuration:", headerLine, "->", result);
  return result;
}

function splitHeaderLine(headerLine) {
  const durationRegex = getDurationRegex();
  const match = headerLine.match(durationRegex);
  if (match) {
    const duration = match[0].trim();
    const headerPart = headerLine.replace(durationRegex, '').trim();
    logDebug("splitHeaderLine:", headerLine, "->", { header: headerPart, duration });
    return { header: headerPart, duration };
  }
  return { header: headerLine, duration: '' };
}

/* ================================
   EXPERIENCE EXTRACTION
=============================================== */
function parseExperience(experienceText) {
  let lines = experienceText.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  lines = lines.map(l => l.replace(/^[-•●]\s*/, ''));
  logDebug("parseExperience - lines:", lines);
  
  const experiences = [];
  let i = 0;
  const jobTitleKeywords = ["developer", "engineer", "tester", "manager", "analyst", "programmer", "consultant", "support", "designer"];
  
  while (i < lines.length) {
    const line = lines[i];
    const duration = extractDuration(line);
    if (duration) {
      logDebug("Header line detected:", line);
      let { header, duration: extractedDuration } = splitHeaderLine(line);
      let company = header;
      let role = "";
      
      if (!company) {
        if (i > 0) {
          role = lines[i - 1];
          for (let k = i - 2; k >= 0; k--) {
            if (/,/.test(lines[k])) {
              company = lines[k];
              logDebug("Using previous lines for company and role:", { company, role });
              break;
            }
          }
        }
      }
      
      let roleCandidates = [];
      let startRoleIndex = i + 1;
      if (!role) {
        for (let j = 0; j < 5 && (i + j + 1) < lines.length; j++) {
          const candidate = lines[i + j + 1];
          if (extractDuration(candidate)) break;
          if (candidate.length < 100 && jobTitleKeywords.some(k => candidate.toLowerCase().includes(k))) {
            roleCandidates.push(candidate);
            logDebug("Role candidate found:", candidate);
          }
        }
        if (roleCandidates.length > 0) {
          role = roleCandidates.reduce((a, b) => a.length <= b.length ? a : b);
        }
      }
      
      i = startRoleIndex + (roleCandidates.length > 0 ? roleCandidates.length : 0);
      
      let descBuffer = "";
      while (i < lines.length) {
        const nextLine = lines[i];
        if (extractDuration(nextLine)) {
          logDebug("New header encountered in description, breaking:", nextLine);
          break;
        }
        descBuffer += (descBuffer ? " " : "") + nextLine;
        i++;
      }
      
      let descriptionLines = [];
      if (descBuffer.trim().length > 0) {
        let bullets = descBuffer.split(/\.\s+(?=["']?\s*[A-Z])/g)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .map(s => s.endsWith('.') ? s : s + '.');
        bullets = bullets.flatMap(bullet => {
          const markerRegex = /(?<="App of the Year."\s+)/;
          if (markerRegex.test(bullet)) {
            return bullet.split(markerRegex);
          }
          return bullet;
        });
        descriptionLines.push(...bullets);
        logDebug("Final bullet(s) from buffer:", bullets);
      }
      
      descriptionLines = descriptionLines.map(line => line.trim()).filter(line => line !== "");
      if (role && descriptionLines.length > 0 && descriptionLines[0].toLowerCase().startsWith(role.toLowerCase())) {
        logDebug("Removing redundant description bullet:", descriptionLines[0]);
        descriptionLines[0] = descriptionLines[0].slice(role.length).trim();
        if (descriptionLines[0] === "") {
          descriptionLines.shift();
        }
      }
      if (role && descriptionLines.length === 1 && descriptionLines[0].toLowerCase() === role.toLowerCase()) {
        logDebug("Clearing description since it's only the role text.");
        descriptionLines = [];
      }
      
      logDebug("Parsed experience:", { company, role, duration: extractedDuration, description: descriptionLines });
      experiences.push({
        company,
        role,
        duration: extractedDuration,
        description: descriptionLines,
        matchedSkills: [] // will be merged later
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
  
  resumeData.name = extractNameFromText(text);
  
  const sections = extractSections(text);
  resumeData.education = sections["EDUCATION"] || '';
  
  const gpaMatch = text.match(/GPA\s*[:\-]?\s*([0-9]\.[0-9]+)/i);
  resumeData.gpa = gpaMatch ? parseFloat(gpaMatch[1]) : null;
  
  resumeData.skills = sections["SKILLS"] ? parseSkills(sections["SKILLS"]) : [];
  
  let expText = sections["EMPLOYMENT HISTORY"] || sections["WORK EXPERIENCE"] || sections["PROFESSIONAL EXPERIENCE"] || '';
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
    logDebug("Enhanced combined text:", enhancedText);
    const resumeData = extractResumeData(enhancedText);
    console.log('Extracted Resume Data:', JSON.stringify(resumeData, null, 2));
    return resumeData;
  } catch (error) {
    console.error('Error reading or parsing the PDF file:', error);
  }
}

// Example usage:
// const filePath1 = './src/uploads/resumes/sample_cv_first.pdf';
// parseResumePdf(filePath1);

// const filePath2 = './src/uploads/resumes/sample_cv_second.pdf';
// parseResumePdf(filePath2);

const filePath3 = './src/uploads/resumes/sample_cv_third.pdf';
parseResumePdf(filePath3);

// const filePath4 = './src/uploads/resumes/sample_cv_fourth.pdf';
// parseResumePdf(filePath4);
