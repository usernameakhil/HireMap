const GoogleStrategy = require('passport-google-oauth20').Strategy;
const StudentProfile = require('../models/studentProfile'); 
const RecruiterProfile = require('../models/RecruiterProfile'); 

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        
        // 1. Check Student Pool
        let user = await StudentProfile.findOne({ email });
        // 2. Check Recruiter Pool if not found
        if (!user) user = await RecruiterProfile.findOne({ email });

        if (user) return done(null, user);

        // 3. New User Enlistment
        const state = req.query.state ? JSON.parse(Buffer.from(req.query.state, 'base64').toString()) : {};
        const assignedRole = state.role || 'student';

        if (assignedRole === 'recruiter') {
          user = await RecruiterProfile.create({
            fullName: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            role: 'recruiter',
            companyEmail: email // Initial default
          });
        } else {
          user = await StudentProfile.create({
            fullName: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            role: 'student'
          });
        }
        
        return done(null, user);
      } catch (err) {
        console.error("Neural Enlistment Failure:", err);
        return done(err, null);
      }
    }
  ));
};