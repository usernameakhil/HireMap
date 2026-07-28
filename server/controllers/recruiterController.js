const RecruiterProfile = require('../models/RecruiterProfile');

// --- GET PROFILE ---
exports.getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findById(req.user._id).select('-password');
    if (!profile) return res.status(404).json({ message: "Dossier not found." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- UPDATE PROFILE ---
exports.updateRecruiterProfile = async (req, res) => {
  try {
    // Prevent sensitive fields like password/email from being updated through this specific route
    const { password, email, role, ...updateData } = req.body;

    const updatedProfile = await RecruiterProfile.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile matrix.", error: error.message });
  }
};