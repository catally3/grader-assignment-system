// src/controllers/applicantController.js

import { Op } from 'sequelize';
import db from '../models/index.js';
import transformApplicant from '../utils/transformApplicant.js';

const Applicant = db.Applicant;

/**
 * GET /applicants
 * Returns a lightweight list of all applicants.
 */
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.findAll();
    const applicantJSON = applicants.map(a => a.toJSON());
    const list = transformApplicant.transformApplicantsForListing(applicantJSON);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /applicants/:id
 * Lookup by student_id OR document_id.
 */
const getApplicantById = async (req, res) => {
  try {
    const id = req.params.id;
    const applicant = await Applicant.findOne({
      where: {
        [Op.or]: [
          { student_id:  id },
          { document_id: id }
        ]
      }
    });
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /applicants
 * Creates a new applicant record.
 */
const createApplicant = async (req, res) => {
  try {
    const newApp = await Applicant.create(req.body);
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /applicants/:id
 * Updates an existing applicant, looked up by student_id or document_id.
 */
const updateApplicant = async (req, res) => {
  try {
    const id = req.params.id;
    const applicant = await Applicant.findOne({
      where: {
        [Op.or]: [
          { student_id:  id },
          { document_id: id }
        ]
      }
    });
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    await applicant.update(req.body);
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /applicants/:id
 * Removes an applicant by student_id or document_id.
 */
const deleteApplicant = async (req, res) => {
  try {
    const id = req.params.id;
    const applicant = await Applicant.findOne({
      where: {
        [Op.or]: [
          { student_id:  id },
          { document_id: id }
        ]
      }
    });
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    await applicant.destroy();
    res.json({ message: 'Applicant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicant,
  deleteApplicant
};
