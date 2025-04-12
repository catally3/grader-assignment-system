// src/controllers/candidateController.js
import db from '../models/index.js';
import transformCandidates from '../utils/transformCandidate.js';
const Candidate = db.Candidate;

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    // Convert candidates to JSON and then transform them.
    const candidateJSON = candidates.map(c => c.toJSON());
    const lightweightCandidates = transformCandidates.transformCandidatesForListing(candidateJSON);
    res.json(lightweightCandidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    // Return full candidate details here.
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCandidate = async (req, res) => {
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

const deleteCandidate = async (req, res) => {
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
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};
