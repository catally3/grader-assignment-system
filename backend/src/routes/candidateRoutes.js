import express from 'express';
import candidateController from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.createCandidate);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

export default router;
