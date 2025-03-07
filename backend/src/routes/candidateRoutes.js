// backend/src/routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET /api/candidates
router.get('/', candidateController.getCandidates);

module.exports = router;
