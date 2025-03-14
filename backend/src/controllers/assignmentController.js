import db from '../models/index.js';
const { Assignment, Candidate, Course } = db;

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [Candidate, Course]
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: 'Assignment not found' });
    await assignment.update(req.body);
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: 'Assignment not found' });
    await assignment.destroy();
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
};
