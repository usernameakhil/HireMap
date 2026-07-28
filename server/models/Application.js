const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruiterProfile', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true }, 
  studentName: { type: String, required: true },
  resumeDriveLink: { type: String, required: true }, // The Drive Link
  resumeFitScore: { type: Number, default: 0 },    // JobFit Score
  analysisScore: { type: Number, default: 0 },     // Resume Strength Score
  status: { type: String, enum: ['Pending', 'Shortlisted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);