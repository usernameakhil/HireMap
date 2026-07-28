const express = require('express');
const router = express.Router();
const collabController = require('../controllers/collabController');

// Endpoint: POST http://localhost:5001/api/collab/submit
router.post('/submit', collabController.submitCollaboration);

module.exports = router;