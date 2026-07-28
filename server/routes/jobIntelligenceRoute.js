const express = require('express');
const router = express.Router();
const { getPlatformRecommendations } = require('../controllers/jobIntelligence');
// Import the protection middleware
const { protect } = require('../middleware/authMiddleware'); 

// POST request for AI discovery - Added 'protect' middleware
router.post('/recommend', protect, getPlatformRecommendations);

module.exports = router;