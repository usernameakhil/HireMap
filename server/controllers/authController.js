const StudentProfile = require('../models/studentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- STEP 1: REGISTRATION OTP DISPATCH ---
const sendRegistrationOTP = async (req, res) => {
  const { email, role } = req.body;
  try {
    if (!role) return res.status(400).json({ message: "Role selection is mandatory." });

    const ActiveModel = role === 'recruiter' ? RecruiterProfile : StudentProfile;
    const normalizedEmail = email.toLowerCase().trim();
    
    const userExists = await ActiveModel.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'Identity already exists in this pool.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send Email via Resend API (Bypasses SMTP blocks)
    await resend.emails.send({
      from: 'HireMap <auth@hiremap.co.in>',
      to: normalizedEmail,
      subject: 'Your Registration OTP',
      html: `<p>Your OTP for HireMap registration is: <strong>${otp}</strong>. This code expires in 5 minutes.</p>`
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("OTP_SEND_ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// --- STEP 2: VERIFY AND REGISTER ---
const verifyOTPAndRegister = async (req, res) => {
  const { name, email, phone, password, role, companyEmail, otp } = req.body;
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await Otp.findOne({ email: normalizedEmail });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (!phone) return res.status(400).json({ message: "Phone number is compulsory for all users." });

    const ActiveModel = role === 'recruiter' ? RecruiterProfile : StudentProfile;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      fullName: name,
      email: normalizedEmail,
      phone: phone, 
      password: hashedPassword,
      role: role
    };

    if (role === 'recruiter') {
      userData.companyEmail = (companyEmail || normalizedEmail).toLowerCase();
    }

    const user = await ActiveModel.create(userData);
    await Otp.deleteOne({ email: normalizedEmail });

    res.status(201).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("VERIFY_REG_ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN USER ---
const loginUser = async (req, res) => {
  const { email, password, role } = req.body; 
  try {
    if (!role) return res.status(400).json({ message: "Please select a role." });

    const ActiveModel = role === 'recruiter' ? RecruiterProfile : StudentProfile;
    const user = await ActiveModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or incorrect role selected." });
    }

    if (!user.password) {
      return res.status(401).json({ message: "Account created via Google. Please use Google Login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// --- FORGOT PASSWORD (OTP DISPATCH) ---
const forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  try {
    const ActiveModel = role === 'recruiter' ? RecruiterProfile : StudentProfile;
    const user = await ActiveModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(404).json({ message: "Email not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Send Email via Resend API
    await resend.emails.send({
      from: 'HireMap Security <auth@hiremap.co.in>',
      to: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });

    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("FORGOT_PW_ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, role } = req.body;
  try {
    const ActiveModel = role === 'recruiter' ? RecruiterProfile : StudentProfile;
    const user = await ActiveModel.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("RESET_PW_ERROR:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
};

module.exports = { 
  sendRegistrationOTP,
  verifyOTPAndRegister,
  loginUser, 
  forgotPassword, 
  resetPassword 
};
