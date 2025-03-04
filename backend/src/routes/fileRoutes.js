const express = require('express');
const multer = require('multer');
const router = express.Router();
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), fileController.uploadFile);

module.exports = router;
