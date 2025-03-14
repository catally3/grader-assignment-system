import express from 'express';
import exportController from '../controllers/exportController.js';

const router = express.Router();

router.get('/csv', exportController.exportCSV);
router.get('/excel', exportController.exportExcel);

export default router;
