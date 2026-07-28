const Application = require('../models/Application');
const Job = require('../models/Job');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// --- 1. SUBMIT & ANALYZE ---
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, recruiterId, studentName, resumeDriveLink } = req.body;

    if (!req.file) return res.status(400).json({ message: "PDF Dossier required for AI analysis." });
    
    // 1. Fetch Job and Check Limits
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job target not found." });

    // Check if the job has already reached its CV limit
    if (!job.isActive || (job.cvLimit !== 0 && job.currentApplicants >= job.cvLimit)) {
      return res.status(403).json({ message: "CV Limit reached. This deployment node is no longer accepting enlistments." });
    }

    let resumeFitScore = 0;
    let analysisScore = 0;

    try {
      const fitForm = new FormData();
      fitForm.append('resume', fs.createReadStream(req.file.path));
      fitForm.append('jobDescription', job.description);

      const fitRes = await axios.post(`${process.env.INTERNAL_URL}/api/analyze/resume`, fitForm, {
        headers: { 
          ...fitForm.getHeaders(),
          'Authorization': req.headers.authorization 
        }
      });
      resumeFitScore = fitRes.data.matchPercentage || 0;

      const strengthForm = new FormData();
      strengthForm.append('resume', fs.createReadStream(req.file.path));

      const strengthRes = await axios.post(`${process.env.INTERNAL_URL}/api/resumeanalyze/resume`, strengthForm, {
        headers: { 
          ...strengthForm.getHeaders(),
          'Authorization': req.headers.authorization 
        }
      });
      analysisScore = strengthRes.data.score || 0;

    } catch (aiErr) {
      console.error("AI Analysis components timed out, using fallback scores", aiErr.message);
    }

    // 2. SAVE APPLICATION
    const newApplication = new Application({
      jobId,
      recruiter: recruiterId,
      applicant: req.user._id,
      studentName,
      resumeDriveLink,
      resumeFitScore, 
      analysisScore    
    });

    await newApplication.save();

    // 3. INCREMENT JOB COUNTER & AUTO-DEACTIVATE
    job.currentApplicants += 1;
    if (job.cvLimit !== 0 && job.currentApplicants >= job.cvLimit) {
      job.isActive = false; // Kill-switch: hide from feed
    }
    await job.save();

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.status(201).json({ 
      message: "Operator Enlisted & Dual-Analysis Verified",
      resumeFitScore,
      analysisScore
    });
  } catch (err) {
    console.error("ENLISTMENT_CRASH:", err);
    res.status(500).json({ message: "Internal Matrix Failure" });
  }
};

// --- 2. GET STUDENT HISTORY ---
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Retrieval Error", error: err.message });
  }
};

// --- 3. GET RECRUITER VIEW (Applicants for one job) ---
exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ jobId })
      .sort({ resumeFitScore: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: "Recruiter Sync Error", error: err.message });
  }
};

// --- 4. UPDATE APPLICATION STATUS (Fixes 404 and Syncs Dashboard) ---
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Application record not found in the matrix." });
    }

    res.status(200).json({
      message: `Status updated to ${status}`,
      updatedApp
    });
  } catch (err) {
    console.error("STATUS_UPDATE_ERROR:", err);
    res.status(500).json({ message: "Failed to update decision matrix." });
  }
};