const express = require('express');
const multer = require('multer');
const router = express.Router();
const importCandidateController = require('../controllers/importCandidateController');
const importCourseController = require('../controllers/importCourseController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the folder exists.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Import candidates.
router.post('/candidates', upload.single('file'), importCandidateController.uploadCandidates);
// Import courses.
router.post('/courses', upload.single('file'), importCourseController.uploadCourses);

module.exports = router;
