const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route: POST /api/support/request
router.post('/request', contactController.handleContactInquiry);

module.exports = router;