const express = require('express');
const passport = require('passport'); 
const jwt = require('jsonwebtoken'); 
const router = express.Router();

// Ensure path matches your directory structure
// I have added the new OTP functions to this destructuring block
const { 
  sendRegistrationOTP, 
  verifyOTPAndRegister,
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// --- STANDARD PROTOCOLS ---
// Note: We are using the new OTP-based registration flow instead of the old /register
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- AXON GRID: OTP REGISTRATION PROTOCOLS ---
router.post('/register-otp', sendRegistrationOTP);
router.post('/register-verify', verifyOTPAndRegister);

// --- AXON GRID: GOOGLE SYNC PROTOCOLS ---

/**
 * @desc Initiate Google OAuth and pass the chosen role via 'state'
 */
router.get('/google', (req, res, next) => {
  const { role } = req.query;
  const state = role ? Buffer.from(JSON.stringify({ role })).toString('base64') : undefined;
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    state: state 
  })(req, res, next);
});

/**
 * @desc Handle successful Google authentication and redirect to frontend
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      // Create JWT with identity data
      const token = jwt.sign(
        { 
          id: req.user._id, 
          role: req.user.role, 
          fullName: req.user.fullName,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
      );

      // Redirect back to the Grid UI
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login-success?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Neural Handshake Redirection Fault:", error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }
  }
);

module.exports = router;