import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    if (file.mimetype === 'application/pdf') {
      dir = 'uploads/resumes';
    } else if (file.mimetype.includes('excel') || file.mimetype.includes('csv')) {
      dir = 'uploads/files';
    } else {
      dir = 'uploads/others';
    }
    // Create the directory if it doesn't exist.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
