// src/controllers/candidateController.js
import db from '../models/index.js';
import transformApplicant from '../utils/transformApplicant.js';
const Candidate = db.Candidate;

const getAllApplicants = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    // Convert candidates to JSON and then transform them.
    const candidateJSON = candidates.map(c => c.toJSON());
    const lightweightCandidates = transformApplicant.transformCandidatesForListing(candidateJSON);
    res.json(lightweightCandidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getApplicantById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    // Return full candidate details here.
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createApplicant = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateApplicant = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: 'Candidate not found' });
    await candidate.update(req.body);
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteApplicant = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate)
      return res.status(404).json({ error: 'Candidate not found' });
    await candidate.destroy();
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicant,
  deleteApplicant,
};
