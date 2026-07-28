const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

const { analyzeResumeDeeply, chatWithAI } = require('../controllers/aiController');


const { compareResumes } = require('../controllers/BattleController'); 

const upload = multer({ dest: 'uploads/' });

router.post('/resume-check', protect, upload.single('resume'), analyzeResumeDeeply);

router.post('/chat', protect, chatWithAI);

router.post(
  '/battle', 
  protect, 
  upload.fields([{ name: 'resumeA', maxCount: 1 }, { name: 'resumeB', maxCount: 1 }]), 
  compareResumes
);

module.exports = router;