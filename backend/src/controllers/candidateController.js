// src/controllers/candidateController.js
import db from '../models/index.js';
import transformCandidates from '../utils/transformCandidate.js';

const Candidate = db.Applicant;

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    // Convert candidates to JSON and then transform them.
    const candidateJSON = candidates.map((c) => c.toJSON());
    const lightweightCandidates = transformCandidates.transformCandidatesForListing(candidateJSON);
    res.json(lightweightCandidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a candidate by the applicantId provided in the URL parameter.
 * The applicantId is the one that gets extracted from the PDF filename.
 */
const getCandidateById = async (req, res) => {
  try {
    // req.params.id is now interpreted as the applicantId.
    const applicantId = req.params.id;
    const candidate = await Candidate.findOne({ where: { applicantId } });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
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
    // Update candidate by applicantId instead of PK.
    const candidate = await Candidate.findOne({
      where: { applicantId: req.params.id }
    });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    await candidate.update(req.body);
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    // Delete candidate by applicantId.
    const candidate = await Candidate.findOne({
      where: { applicantId: req.params.id }
    });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    await candidate.destroy();
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCandidates,
  getCandidateById, // Uses applicantId
  createCandidate,
  updateCandidate, // Uses applicantId
  deleteCandidate // Uses applicantId
};
