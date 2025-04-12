import express from 'express';
import matchController from '../controllers/matchController.js';

const router = express.Router();

router.post('/', matchController.runMatching);
router.get('/results', matchController.getMatchingResults);
router.post('/reassign', matchController.reassign);

export default router;
