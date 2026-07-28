const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

// Import ONLY compareResumes from BattleController
const { compareResumes } = require('../controllers/BattleController'); 

const upload = multer({ dest: 'uploads/' });

// Route
router.post(
  '/battle', 
  protect, 
  upload.fields([{ name: 'resumeA', maxCount: 1 }, { name: 'resumeB', maxCount: 1 }]), 
  compareResumes
);

module.exports = router;