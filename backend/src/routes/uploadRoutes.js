import express from 'express';
import upload from '../middlewares/fileUpload.js';
import uploadController from '../controllers/uploadController.js';
// import exportController from '../controllers/exportController.js'; // or merge with uploadController

const router = express.Router();

// Existing endpoints...
router.post('/cv', upload.single('cv'), uploadController.processCV);
router.post('/courses', upload.single('courses'), uploadController.processCourseFile);

// New endpoint for the merged PDF pipeline:
// router.post('/merged-pdf', upload.single('mergedPdf'), exportController.processMergedPDFPipeline);

export default router;
