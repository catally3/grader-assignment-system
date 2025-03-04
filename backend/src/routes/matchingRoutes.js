const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

// Run matching algorithm.
router.post('/run', matchingController.runMatching);
// Retrieve current assignments.
router.get('/', matchingController.getAssignments);
// Update a specific assignment (manual override).
router.put('/:assignmentId', matchingController.updateAssignment);
// Export matching results as CSV.
router.get('/export', matchingController.exportMatching);

module.exports = router;
