// backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/courses
router.get('/', courseController.getCourses);

module.exports = router;
