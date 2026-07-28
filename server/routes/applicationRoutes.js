const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temp storage for PDF processing

// Destructure every function needed
const { 
  submitApplication, 
  getApplicantsByJob, 
  getMyApplications,
  updateApplicationStatus // <--- Added this
} = require('../controllers/applicationController');

const { protect } = require('../middleware/authMiddleware');

// 1. History (Must come before dynamic params)
router.get('/my-applications', protect, getMyApplications);

// 2. Multi-part Post (PDF + Metadata)
router.post('/', protect, upload.single('resumeFile'), submitApplication);

// 3. Recruiter Specific - Get Applicants for a specific job
router.get('/job/:jobId', protect, getApplicantsByJob);

// 4. Update Status - Matches frontend `${API_URL}/api/applications/${appId}/status`
router.patch('/:id/status', protect, updateApplicationStatus); // <--- Added this

module.exports = router;