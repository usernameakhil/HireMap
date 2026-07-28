const Job = require('../models/Job');

/**
 * INTERNAL UTILITY: Recruiter Verification
 * Ensures only authorized recruiter nodes can modify the deployment matrix.
 */
const validateRecruiter = (req, res) => {
  if (!req.user || req.user.role !== 'recruiter') {
    res.status(403).json({ message: "Access Denied: Restricted to recruiter nodes." });
    return false;
  }
  return true;
};

// --- 1. INITIATE DEPLOYMENT (Create Job) ---
exports.createJob = async (req, res) => {
  try {
    if (!validateRecruiter(req, res)) return;

    const { visibilityDuration, cvLimit } = req.body;

    // LOGIC: Calculate Expiry Date based on selected duration
    const daysToLive = parseInt(visibilityDuration) || 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToLive);

    // LOGIC: Sanitize CV Limit (Strip "CVs" text and cast to Number)
    let cleanLimit = 0;
    if (typeof cvLimit === 'string') {
      cleanLimit = parseInt(cvLimit.replace(/\D/g, '')) || 0;
    } else {
      cleanLimit = Number(cvLimit) || 0;
    }

    const newJob = new Job({
      ...req.body,
      cvLimit: cleanLimit,
      recruiter: req.user._id,
      expiresAt: expiryDate,
      currentApplicants: 0, // Initialize counter
      isActive: true        // Initialize as active
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.error("DEPLOYMENT_ABORTED:", err.message);
    res.status(500).json({ 
      message: "Deployment Aborted: Validation Failure", 
      error: err.message 
    });
  }
};

// --- 2. RECRUITER NODE SYNC (Get Own Jobs) ---
exports.getRecruiterJobs = async (req, res) => {
  try {
    if (!validateRecruiter(req, res)) return;
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Sync Error" });
  }
};

// --- 3. TARGET NODE RETRIEVAL (Get Single Job) ---
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name companyName');
    if (!job) return res.status(404).json({ message: "Node not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Retrieval Error" });
  }
};

// --- 4. RECALIBRATE NODE (Update Job) ---
exports.updateJob = async (req, res) => {
  try {
    if (!validateRecruiter(req, res)) return;

    const updateData = { ...req.body };
    
    // Safety check for CV limit updates during editing
    if (updateData.cvLimit && typeof updateData.cvLimit === 'string') {
      updateData.cvLimit = parseInt(updateData.cvLimit.replace(/\D/g, '')) || 0;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
};

// --- 5. TERMINATE NODE (Delete Job) ---
exports.deleteJob = async (req, res) => {
  try {
    if (!validateRecruiter(req, res)) return;
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Node terminated" });
  } catch (err) {
    res.status(500).json({ message: "Termination Failed" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Public sync error" });
  }
};