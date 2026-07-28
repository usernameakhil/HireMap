const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  website: { type: String, trim: true },
  type: { 
    type: String, 
    enum: ['Full-time', 'Internship', 'Contract', 'Part-time'], 
    required: true 
  },
  mode: { 
    type: String, 
    enum: ['Remote', 'On-site', 'Hybrid'], 
    required: true 
  },
  salary: { type: String },
  address: { type: String, required: true },
  description: { type: String, required: true },
  
  // --- UPDATED THRESHOLDS ---
  cvLimit: { 
    type: Number, // Changed to Number for logic comparison
    default: 100 
  },
  currentApplicants: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },

  recruiter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RecruiterProfile', 
    required: true 
  },
  visibilityDuration: { type: String, required: true }, 
  expiresAt: { type: Date, required: true } 
}, { 
  timestamps: true 
});

jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);