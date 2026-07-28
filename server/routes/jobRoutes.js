const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getJobs, 
  getRecruiterJobs, 
  getJobById,    
  updateJob,     
  deleteJob 
} = require('../controllers/jobController'); 
const { protect } = require('../middleware/authMiddleware');

// 1. PUBLIC JOBS
router.get('/', getJobs);

// 2. RECRUITER SPECIFIC (Must be above /:id)
router.get('/my-jobs', protect, getRecruiterJobs);

// 3. CRUD OPERATIONS
router.post('/', protect, createJob);
router.get('/:id', protect, getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob); 

module.exports = router;