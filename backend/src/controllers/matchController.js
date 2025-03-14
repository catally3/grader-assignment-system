import db from '../models/index.js';
import matchingAlgorithm from '../utils/matchingAlgorithm.js';
const { Candidate, Course, Assignment, Sequelize } = db;

const runMatching = async (req, res) => {
  try {
    // Retrieve all candidates and courses
    const candidates = await Candidate.findAll();
    const courses = await Course.findAll();
    // Execute the matching algorithm (a simple heuristic example)
    const results = await matchingAlgorithm.matchCandidatesToCourses(candidates, courses);
    // Save assignments into the database
    for (let result of results) {
      await Assignment.create({
        candidateId: result.candidateId,
        courseId: result.courseId,
        score: result.score,
        reasoning: result.reasoning,
      });
    }
    res.json({ message: 'Matching completed', assignments: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMatchingResults = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [Candidate, Course]
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reassign = async (req, res) => {
  try {
    // For simplicity, re-run matching for courses with no assignments.
    const allAssignments = await Assignment.findAll();
    const assignedCandidateIds = allAssignments.map(a => a.candidateId);
    const availableCandidates = await Candidate.findAll({
      where: {
        id: { [Sequelize.Op.notIn]: assignedCandidateIds }
      }
    });
    const courses = await Course.findAll();
    // Filter out courses that already have an assignment (simple example).
    const coursesToReassign = [];
    for (const course of courses) {
      const count = await Assignment.count({ where: { courseId: course.id } });
      if (count === 0) {
        coursesToReassign.push(course);
      }
    }
    const results = await matchingAlgorithm.matchCandidatesToCourses(availableCandidates, coursesToReassign);
    for (let result of results) {
      await Assignment.create({
        candidateId: result.candidateId,
        courseId: result.courseId,
        score: result.score,
        reasoning: result.reasoning,
      });
    }
    res.json({ message: 'Reassignment completed', assignments: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  runMatching,
  getMatchingResults,
  reassign,
};
