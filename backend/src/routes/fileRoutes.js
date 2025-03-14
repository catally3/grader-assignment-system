import express from 'express';
import { listFiles, downloadFile } from '../controllers/fileController.js';

const router = express.Router();

// Endpoint to list files; use query parameter, e.g., /api/files?category=resumes
router.get('/', listFiles);

// Endpoint to download a file by specifying category and filename in the URL.
router.get('/:category/:filename', downloadFile);

export default router;
