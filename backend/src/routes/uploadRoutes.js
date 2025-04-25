// routes/uploadRoutes.js

import express from 'express';
import fileUpload from '../middlewares/fileUpload.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

// 1) Candidate-list Excel (.xlsx/.xls)
//    field name ⇒ "candidateList"
router.post(
  '/candidates',
  fileUpload.single('candidateList'),
  uploadController.processCandidateFile
);

// 2) Course/professor CSV or Excel
//    field name ⇒ "courseList"
router.post(
  '/courses',
  fileUpload.single('courseList'),
  uploadController.processCourseFile
);

// 3) ZIP of resumes
//    field name ⇒ "resumeZip"
router.post(
  '/resumes',
  fileUpload.single('resumeZip'),
  uploadController.processResumeZip
);

// 4) Single PDF resume
//    field name ⇒ "resumeFile"
router.post(
  '/cv',
  fileUpload.single('resumeFile'),
  uploadController.processCV
);

export default router;
