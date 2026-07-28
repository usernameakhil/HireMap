const express = require('express');
const router = express.Router();
const { getRecruiterProfile, updateRecruiterProfile } = require('../controllers/recruiterController');
const { protect } = require('../middleware/authMiddleware');

// Secure all recruiter routes
router.get('/profile', protect, getRecruiterProfile);
router.put('/profile', protect, updateRecruiterProfile);

module.exports = router;