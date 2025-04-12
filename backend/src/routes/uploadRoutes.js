import express from 'express';
import upload from '../middlewares/fileUpload.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

// Existing endpoints:
router.post('/cv', upload.single('cv'), uploadController.processCV);
router.post('/courses', upload.single('courses'), uploadController.processCourseFile);

// New endpoint for ZIP file uploads:
router.post('/cv/zip', upload.single('cvZip'), uploadController.processResumeZip);

export default router;
