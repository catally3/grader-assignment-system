import db from '../models/index.js';
const { Course } = db;

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res.status(404).json({ error: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course)
      return res.status(404).json({ error: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
