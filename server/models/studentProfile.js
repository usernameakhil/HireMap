const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: String, company: String, duration: String, desc: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String, school: String, year: String, grade: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: String, tech: String, link: String, desc: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } 
  },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['student'], default: 'student' },
  
  // FIXED: No default null. Sparse index ignores missing fields to prevent E11000.
  resumeEmail:{ type: String, unique: true, sparse: true }, 

  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  jobRoles: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  achievements: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  atsScore: { type: Number, default: 0 },
  coins: { type: Number, default: 10},
  links: {
    leetcode: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', default: null },
  isCompetingGlobal: { type: Boolean, default: false },
  resetOtp: { type: String },
  resetOtpExpire: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
