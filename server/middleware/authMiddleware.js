const jwt = require('jsonwebtoken');
const RecruiterProfile = require('../models/RecruiterProfile');
const StudentProfile = require('../models/studentProfile');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [recruiter, student] = await Promise.all([
        RecruiterProfile.findById(decoded.id).select('-password'),
        StudentProfile.findById(decoded.id).select('-password')
      ]);

      const user = recruiter || student;
      if (!user) return res.status(401).json({ message: 'Authorization failed: Node not found.' });

      req.user = user;
      next();
    } catch (error) {
      console.error("AUTH_PROTECT_ERROR:", error.message);
      res.status(401).json({ message: 'Authorization failed: Invalid token.' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token found.' });
  }
};

module.exports = { protect };