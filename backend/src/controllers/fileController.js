import fs from 'fs';
import path from 'path';

/**
 * List files in a given category.
 * Category is expected as a query parameter (e.g. ?category=resumes).
 */
export const listFiles = (req, res) => {
  try {
    const category = req.query.category || ''; // e.g. "resumes", "files", or "others"
    const directory = path.join('uploads', category);

    if (!fs.existsSync(directory)) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    fs.readdir(directory, (err, files) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ files });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Download a file from a given category.
 * URL should include the category and filename.
 * For example: GET /api/files/resumes/1741500713997-sample_cv_fourth.pdf
 */
export const downloadFile = (req, res) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join('uploads', category, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
