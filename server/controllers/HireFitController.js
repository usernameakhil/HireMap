const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/studentProfile'); // Added User model
const { syncCache } = require('./studentController'); // Added syncCache helper

// Ensure .env has GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER: Convert local file to Gemini-compatible format ---
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

const HireFit = async (req, res) => {
  try {
    // 1. Validation
    const { jobDescription } = req.body;
    const userId = req.user.id; // Get current user ID from auth middleware
    const COST = 2;

    if (!req.file || !jobDescription) {
      return res.status(400).json({ message: "Both Resume (PDF) and Job Description are required." });
    }

    // --- NEW: COIN DEDUCTION PROTOCOL ---
    // Atomic update: only decrement if coins >= 3
    const user = await User.findOneAndUpdate(
      { _id: userId, coins: { $gte: COST } },
      { $inc: { coins: -COST } },
      { new: true }
    );

    if (!user) {
      return res.status(403).json({ message: "Insufficient Credits. Please top up your wallet." });
    }

    // SYNC REDIS IMMEDIATELY
    // This ensures that when the user refreshes their profile or HireFit page, the balance is updated.
    await syncCache(userId, user);

    // 2. Prepare Inputs for AI
    const resumePart = fileToGenerativePart(req.file.path, "application/pdf");

    // 3. Configure Model (Use 1.5-flash for speed & reliability)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Correcting model version string for standard API
      generationConfig: {
        temperature: 0, 
        topP: 1,
        responseMimeType: "application/json",
      }
    });

    // 4. The Strict Analysis Prompt
    const prompt = `
      You are a strict, algorithmic Application Tracking System (ATS).
      
      **INPUT DATA:**
      1. **Job Description (JD):** "${jobDescription.slice(0, 5000)}"
      2. **Resume:** (Attached PDF)

      **YOUR TASK:**
      Compare the Resume against the Job Description and calculate a "Match Percentage" and a detailed "Metric Breakdown" based on the following **STRICT RUBRIC**. Do not guess.

      **SCORING RUBRIC (Total 100%):**
      - **Technical Skills Match (40%):** How well do the hard skills in the resume match the required skills in the JD?
      - **Experience Relevance (30%):** Alignment of previous job titles and duties with JD requirements.
      - **Keyword Density (20%):** Presence of key industry terms from the JD in a contextual manner.
      - **Education/Certifications (10%):** Meeting educational/certification benchmarks.

      **OUTPUT REQUIREMENTS:**
      Return ONLY a valid JSON object. No markdown.
      {
        "matchPercentage": Number (0-100),
        "breakdown": {
          "skills": Number (0-100),
          "experience": Number (0-100),
          "keywords": Number (0-100),
          "education": Number (0-100)
        },
        "missingSkills": ["List", "of", "critical", "missing", "skills"],
        "improvementPoints": ["Point 1", "Point 2", "Point 3"],
        "strengths": ["Strength 1", "Strength 2"]
      }
    `;

    // 5. Generate Content
    const result = await model.generateContent([prompt, resumePart]);
    const response = await result.response;
    const text = response.text();

    // 6. Clean & Parse JSON
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysisData = JSON.parse(cleanJson);

    // 7. Cleanup File
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    // 8. Send Response
    // We send updatedCoins back so the frontend can update liveCoins state instantly
    res.json({
      success: true,
      ...analysisData,
      updatedCoins: user.coins 
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.status(500).json({ message: "Analysis failed: " + error.message });
  }
};

module.exports = { HireFit };