// fileUpload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
      // For PDF files (individual resumes)
      dir = 'uploads/resumes';
    } else if (
      file.mimetype.includes('excel') ||
      file.mimetype.includes('csv') ||
      ext === '.xlsx' ||
      ext === '.xls'
    ) {
      // For course/professor excel/CSV files.
      dir = 'uploads/files';
    } else if (ext === '.zip') {
      // For ZIP files that contain multiple resumes.
      dir = 'uploads/zips';
    } else {
      // Any other file types.
      dir = 'uploads/others';
    }
    // Create the directory if it doesn't exist.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Prepend the timestamp to ensure unique filenames.
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
