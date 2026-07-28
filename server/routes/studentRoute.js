const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, extractProfileFromResume } = require('../controllers/studentController');

const upload = multer({ dest: 'uploads/' });


router.get('/profile', protect, getProfile);
router.post('/profile/extract', protect, upload.single('resume'), extractProfileFromResume);

module.exports = router;