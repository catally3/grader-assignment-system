const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');

exports.uploadCourses = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const pool = req.app.locals.pool;
  const filePath = req.file.path;
  const fileExt = req.file.originalname.split('.').pop().toLowerCase();

  try {
    let courses = [];
    if (fileExt === 'csv') {
      courses = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    } else if (fileExt === 'xlsx') {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      courses = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    // Insert course records into the database.
    // Expected columns: course_name, required_major, min_gpa, recommended_candidate_id (optional)
    for (let course of courses) {
      await pool.query(
        'INSERT INTO courses (course_name, required_major, min_gpa, recommended_candidate_id) VALUES (?, ?, ?, ?)',
        [
          course.course_name,
          course.required_major,
          course.min_gpa,
          course.recommended_candidate_id || null
        ]
      );
    }

    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Courses imported successfully.', count: courses.length });
  } catch (error) {
    console.error('Error importing courses:', error);
    res.status(500).json({ error: 'Error importing courses.' });
  }
};
