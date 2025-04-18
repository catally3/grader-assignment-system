import express from 'express';
import applicantController from '../controllers/applicantController.js';

const router = express.Router();

router.get('/', applicantController.getAllApplicants);
router.get('/:id', applicantController.getApplicantById);
router.post('/', applicantController.createApplicant);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

export default router;
