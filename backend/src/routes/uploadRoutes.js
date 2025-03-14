import express from 'express';
import upload from '../middlewares/fileUpload.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

// Endpoint to upload a merged PDF of CVs
router.post('/cv', upload.single('cv'), uploadController.processCV);

// Endpoint to upload course/professor data (Excel/CSV)
router.post('/courses', upload.single('courses'), uploadController.processCourseFile);

export default router;
