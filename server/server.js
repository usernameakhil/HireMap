const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const redis = require('redis');
const passport = require('passport'); 

// 1. Load Environment Variables Immediately
dotenv.config(); 

// 2. Initialize Redis Client FIRST and Export it immediately
// This prevents the 'undefined' error in your controllers
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: { reconnectStrategy: (retries) => Math.min(retries * 100, 3000) }
});

redisClient.on('error', (err) => console.log('⚠️ Redis Client Error', err));

// EXPORT HERE so controllers can see it during the 'require' phase
module.exports = { redisClient };

// 3. Now continue with remaining imports
const connectDB = require('./config/db');
const User = require('./models/studentProfile'); 
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); 
const userRoutes = require('./routes/studentRoute');              
const applicationRoutes = require('./routes/applicationRoutes');
const jobIntelligenceRoute = require('./routes/jobIntelligenceRoute');

// 4. Initialize Passport Strategy
require('./config/passport')(passport); 

const warmUpLeaderboards = async () => {
  try {
    console.log("🔥 Starting Leaderboard Warm-up...");
    const users = await User.find({ atsScore: { $gt: 0 } }).select('_id atsScore college');
    for (const user of users) {
      await redisClient.zAdd('global_hierarchy', { score: user.atsScore, value: user._id.toString() });
      if (user.college) {
        await redisClient.zAdd(`college_leaderboard:${user.college}`, { score: user.atsScore, value: user._id.toString() });
      }
    }
    console.log("🏆 Cache Warm-up Complete.");
  } catch (err) { console.error("❌ Warm-up Failed:", err); }
};

const startApp = async () => {
  try {
    const requiredEnv = ['CLIENT_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET'];
    const missing = requiredEnv.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error(`❌ CRITICAL FAILURE: Missing ENV variables: ${missing.join(', ')}`);
      process.exit(1); 
    }

    await connectDB();
    await redisClient.connect();

    const app = express();
    app.set('trust proxy', 1);
    const PORT = process.env.PORT || 5001;

    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    })); 
    app.use(express.json()); 
    app.use(passport.initialize());

    // --- NODE ROUTES ---
    app.use('/api/auth', authRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/users', userRoutes);        
    app.use('/api/applications', applicationRoutes);
    app.use('/api/analyze', require('./routes/HireFitRoutes'));
    app.use('/api/resumeanalyze', require('./routes/ResumeAnalyzerRoute'));
    app.use('/api/job-intelligence', jobIntelligenceRoute);
    app.use('/api/ai', require('./routes/aiRoutes'));
    app.use('/api/battle', require('./routes/BattleRoutes'));
    app.use('/api/recruiter', require('./routes/recruiterRoutes'));
    app.use('/api/payment', require('./routes/paymentRoutes'));
    app.use('/api/collab', require('./routes/collabRoutes'));
    app.get('/', (req, res) => res.send('HIREMAP API Operational...'));
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
      });
    });
    app.use('/api/support', require('./routes/contactRoutes'));

    app.listen(PORT, () => {
      
      warmUpLeaderboards(); 
    });
  } catch (error) {
    console.error( error);
    process.exit(1);
  }
};

startApp();