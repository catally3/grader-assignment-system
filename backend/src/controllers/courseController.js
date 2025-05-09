// src/controllers/courseController.js

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Course, Recommendation } = db;

// List all courses, including their recommendations
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: Recommendation,
        // since you didn’t set an alias, Sequelize will add a `.Recommendations` array
        attributes: ['applicant_name','applicant_net_id']
      }]
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single course by numeric ID or by natural key (course#-section-semester),
// and include its recommendations
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    let where;
    if (/^\d+$/.test(id)) {
      where = { id };
    } else {
      const [course_number, course_section, semester] = id.split('-');
      where = { course_number, course_section, semester };
    }

    const course = await Course.findOne({
      where,
      include: [{
        model: Recommendation,
        attributes: ['applicant_name','applicant_net_id']
      }]
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new course (recommendations aren’t created here)
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing course by numeric ID or natural key
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let course;

    if (/^\d+$/.test(id)) {
      course = await Course.findByPk(id);
    } else {
      const [course_number, course_section, semester] = id.split('-');
      course = await Course.findOne({ where: { course_number, course_section, semester } });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await course.update(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a course by numeric ID or natural key
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let course;

    if (/^\d+$/.test(id)) {
      course = await Course.findByPk(id);
    } else {
      const [course_number, course_section, semester] = id.split('-');
      course = await Course.findOne({ where: { course_number, course_section, semester } });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
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
  deleteCourse
};
