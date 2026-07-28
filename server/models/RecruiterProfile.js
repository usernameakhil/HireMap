const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } // Optional for Google Users
  },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, default: 'recruiter', enum: ['recruiter'] },

  designation: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  
  companyEmail: { 
    type: String, 
    lowercase: true,
    required: function() { return !this.googleId; } // Google users can set this later
  },
  companyName: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  companyIndustry: { 
    type: String, 
    default: 'Technology',
    enum: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'E-commerce', 'Other'] 
  },
  officeAddress: { type: String, default: '' },
  hiringSpecialties: { type: [String], default: [] },

  isVerified: { type: Boolean, default: false },
  verificationSource: { type: String, enum: ['domain', 'manual', 'none'], default: 'none' },
  resetOtp: { type: String },
  resetOtpExpire: { type: Date }

}, { timestamps: true });

module.exports = mongoose.models.RecruiterProfile || mongoose.model('RecruiterProfile', recruiterProfileSchema);