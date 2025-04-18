import fs from 'fs';
import pdfParse from 'pdf-parse';

const DEBUG = true;
function logDebug(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}

/* ================================
   CLEANUP / ENHANCEMENT
=============================================== */
function enhanceText(text) {
  let r = text;
  r = r.replace(/[“”]/g, '"');
  r = r.replace(/,(\S)/g, ', $1');
  r = r.replace(/([A-Z]{2,})(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi, '$1 $2');
  r = r.replace(/([A-Za-z])(\d)/g, '$1 $2').replace(/(\d)([A-Za-z])/g, '$1 $2');
  r = r.replace(/\s{2,}/g, ' ');
  return r.trim();
}

/* ================================
   SECTION SPLITTING
=============================================== */
const SECTION_KEYWORDS = [
  'PROFESSIONAL SUMMARY','PROFILE','EXPERIENCE','WORK EXPERIENCE','WORK HISTORY',
  'PROFESSIONAL EXPERIENCE','EMPLOYMENT HISTORY','EDUCATION','EDUCATION & TRAINING',
  'SKILLS','CORE COMPETENCIES','TECHNICAL SKILLS','CERTIFICATIONS','AWARDS'
];

function isHeader(line) {
  const up = line.trim().toUpperCase();
  if (SECTION_KEYWORDS.some(k => up === k || up.startsWith(k + ':'))) return true;
  // all caps + short
  if (/^[A-Z0-9 &\-\/]+$/.test(line) && line.length < 40 && line.split(' ').length <= 5) {
    return true;
  }
  // ends with colon
  if (line.trim().endsWith(':')) return true;
  return false;
}

function extractSections(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let current = 'PROFILE';
  const sections = { PROFILE: [] };

  for (let raw of lines) {
    if (isHeader(raw)) {
      current = raw.replace(/:$/,'').toUpperCase();
      sections[current] = [];
    } else {
      sections[current].push(raw);
    }
  }
  // join + enhance each
  for (let sec in sections) {
    sections[sec] = enhanceText(sections[sec].join('\n'));
  }
  return sections;
}

/* ================================
   NAME EXTRACTION
=============================================== */
function extractName(text, sections) {
  // 1) first non-empty line:
  const first = text.split('\n').find(l => l.trim());
  if (first && /^[A-Z][A-Za-z ,.'-]{1,30}$/.test(first.trim())) {
    return first.trim();
  }
  // 2) line before email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) {
    const before = text.split('\n').map(l=>l.trim());
    const idx = before.findIndex(l=>l.includes(emailMatch[0]));
    if (idx > 0) return before[idx-1];
  }
  return '';
}

/* ================================
   SKILLS EXTRACTION
=============================================== */
function parseSkills(skillsText='') {
  return Array.from(new Set(
    skillsText
      .split(/[\n●•\-\*;|,\/]+/)       // bullets, commas, pipes
      .map(s => s.replace(/(proficient in|expert in|skills?:)/i,'').trim())
      .filter(s => s && s.length <= 50)
  ));
}

/* ================================
   EDUCATION EXTRACTION
=============================================== */
function parseEducation(edText='') {
  const lines = edText.split('\n');
  const degreeLines = lines.filter(l =>
    /(Bachelor|Master|B\.S\.?|M\.A\.?|Ph\.D\.?|Associate)/i.test(l)
  );
  return degreeLines.join('\n');
}

/* ================================
   DURATION PARSING
=============================================== */
function getDurationRegex() {
  const datePart = '(?:\\d{1,2}\\/\\d{4}|\\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4})';
  return new RegExp(`${datePart}\\s*(?:[–\\-]|to|until)\\s*(?:Present|${datePart})`, 'i');
}
function extractDuration(line) {
  const m = line.match(getDurationRegex());
  return m ? m[0].trim() : null;
}

/* ================================
   EXPERIENCE EXTRACTION
=============================================== */
function parseExperience(expText='') {
  const lines = expText.split('\n')
    .map(l=>l.trim().replace(/^[-●•*]\s*/,''))
    .filter(Boolean);
  logDebug('parseExperience lines:', lines);

  const exp = [];
  let i = 0;
  while (i < lines.length) {
    const dur = extractDuration(lines[i]);
    if (dur) {
      const { header: comp, duration } = (() => {
        const re = getDurationRegex();
        const match = lines[i].match(re);
        if (!match) return { header: lines[i], duration: null };
        return {
          header: lines[i].replace(re,'').trim(),
          duration: match[0]
        };
      })();

      // next line with a common role keyword
      let role = '';
      for (let j = i+1; j < Math.min(lines.length, i+6); j++) {
        if (/(developer|engineer|manager|analyst|consultant|support|intern)/i.test(lines[j])) {
          role = lines[j];
          i = j;
          break;
        }
      }
      i++;
      let descBuf = '';
      while (i < lines.length && !extractDuration(lines[i])) {
        descBuf += (descBuf ? ' ' : '') + lines[i++];
      }
      const bullets = descBuf
        .split(/\.\s+/)
        .map(s=>s.trim())
        .filter(Boolean)
        .map(s=>s.endsWith('.')?s:s+'.');

      exp.push({ company: comp, role, duration, description: bullets, matchedSkills: [] });
    } else {
      i++;
    }
  }
  return exp;
}

/* ================================
   TIE IT ALL TOGETHER
=============================================== */
function extractResumeData(text) {
  const data = {};
  const sections = extractSections(text);

  data.name    = extractName(text, sections);
  data.email   = (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)||[])[0]||'';
  data.phone   = (text.match(/(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)||[])[0]||'';

  data.education = parseEducation(sections['EDUCATION']||'');

  data.skills    = parseSkills(sections['SKILLS']|| sections['CORE COMPETENCIES']||'');

  // find an EXPERIENCE‑like section
  const expKey = Object.keys(sections)
    .find(k => /EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE/.test(k));
  const rawExp = expKey ? sections[expKey] : '';
  data.experience = parseExperience(rawExp || text);

  // match skills into each job
  data.experience.forEach(job => {
    job.matchedSkills = job.description.filter(d =>
      data.skills.some(s => d.toLowerCase().includes(s.toLowerCase()))
    );
  });

  return data;
}

/* ================================
   ENTRYPOINT
=============================================== */
async function parseResumePdf(filePath) {
  const buf  = fs.readFileSync(filePath);
  const { text } = await pdfParse(buf);
  const cleaned = enhanceText(text);
  logDebug('Cleaned text chunk:', cleaned.slice(0,200)+'…');
  const out = extractResumeData(cleaned);
  console.log('Extracted Resume Data:', JSON.stringify(out, null,2));
  return out;
}

// Example usage:
const filePath1 = './src/uploads/resumes/sample_cv_first.pdf';
parseResumePdf(filePath1);

// const filePath2 = './src/uploads/resumes/sample_cv_fourth.pdf';
// parseResumePdf(filePath2);

// const filePath3 = './src/uploads/resumes/sample_cv_third.pdf';
// parseResumePdf(filePath3);

// const filePath4 = './src/uploads/resumes/Resumes-18.pdf';
// parseResumePdf(filePath4);