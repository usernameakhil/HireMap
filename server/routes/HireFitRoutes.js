const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { HireFit } = require('../controllers/HireFitController');

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/analyze/resume
// Handles both the file upload ('resume') and the body data ('jobDescription')
router.post('/resume', protect, upload.single('resume'), HireFit);

module.exports = router;