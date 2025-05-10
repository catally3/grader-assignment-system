import db from '../models/index.js';
import matchCandidatesToCourses from '../services/matchingAlgorithm.js';
const { Applicant, Course, Assignment, Sequelize } = db;

const runMatching = async (req, res) => {
  try {
    const results = await matchCandidatesToCourses();
    // Save assignments into the database
    for (let result of results) {
      await Assignment.create({
        applicant_student_id: result.candidateId,
        course_id: result.courseId,
        score: result.score,
        reasoning: result.reasoning
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
      include: [Applicant, Course]
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
    const assignedCandidateIds = allAssignments.map(
      (a) => a.applicant_student_id
    );
    const availableCandidates = await Applicant.findAll({
      where: {
        student_id: { [Sequelize.Op.notIn]: assignedCandidateIds }
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
    const results = await matchCandidatesToCourses(availableCandidates, coursesToReassign);
    for (let result of results) {
      await Assignment.create({
        applicant_student_id: result.candidateId,
        course_id: result.courseId,
        score: result.score,
        reasoning: result.reasoning
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
  reassign
};
