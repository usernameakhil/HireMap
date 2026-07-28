const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { ResumeAnalyzer } = require('../controllers/ResumeAnalyzerController');

const upload = multer({ dest: 'uploads/' });

// Route: POST /api/analyze/resume
router.post('/resume', protect, upload.single('resume'), ResumeAnalyzer);

module.exports = router;