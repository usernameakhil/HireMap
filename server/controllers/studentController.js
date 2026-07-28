const User = require('../models/studentProfile'); 
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Import the connected client from server.js
const { redisClient } = require('../server'); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to sync redis after any DB update
const syncCache = async (userId, data) => {
  try {
    const cacheKey = `profile:${userId}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const profile = JSON.parse(cachedData);
      // Merge updated fields (like coins or bio) into the cache
      const updatedProfile = { ...profile, ...data.toObject ? data.toObject() : data };
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(updatedProfile));
      console.log(`✨ Redis Sync Complete for ${userId}`);
    }
  } catch (err) {
    console.error("Redis Sync Error:", err);
  }
};

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// --- GET PROFILE (With Redis Cache-Aside) ---
const getProfile = async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `profile:${userId}`;

  try {
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      console.log("✅ Serving from Cache");
      return res.json(JSON.parse(cachedProfile));
    }

    console.log("🔄 Cache Miss: Fetching from MongoDB...");
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
    res.json(user);
  } catch (error) {
    const user = await User.findById(userId).select('-password');
    res.json(user);
  }
};

// --- EXTRACT PROFILE (With Cache Update) ---
const extractProfileFromResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No resume uploaded" });
    const resumePart = fileToGenerativePart(req.file.path, "application/pdf");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { temperature: 0, responseMimeType: "application/json" }
    });

    const prompt = `you are a strict and deterministic Resume Parser.
      Analyze the **attached PDF resume**.
      **TASK 1: DATA EXTRACTION**
      Extract: URLs, Summary (generate if missing).
      **TASK 2: ATS SCORING RUBRIC (Strict Math)**
      You are a deterministic ATS Scoring Engine & Auditor.
      **CONTEXT (DYNAMIC DOMAIN DETECTION):**
      You are a strict and deterministic Resume Parser. 
      Analyze the **attached PDF resume**.
      **CONTEXT (DYNAMIC DOMAIN DETECTION):**
      1. First, **analyze the resume to identify the candidate's primary professional domain** (e.g., Data Science, Sales, Nursing, Full Stack Dev, Graphic Design).
      2. Evaluate the resume's skills and experience **based on the standards of THAT specific identified domain**. Do NOT force a specific role (like Full Stack) if the resume is clearly for something else.

      **SCORING RULES (STRICT MATH):**
      Follow this rubric EXACTLY. Do not deviate. Start at 0.

      **SECTION 1: CONTACT INFORMATION (Max 8)**
      +4 if valid email present.
      +4 if valid phone present.

      **SECTION 2: SKILLS RELEVANCE (Max 25)**
      (Evaluated based on the *Inferred Domain* of the candidate)
      +5 for each **Critical Hard Skill** present that is fundamental to the identified domain (Max 20 pts).
      (Example: If Data Scientist -> Python, SQL, ML, Pandas. If HR -> Recruiting, Compliance, ATS, Employee Relations).
      +1 for each **Tool/Software/Framework** relevant to the domain (Max 5 pts).
      
      **SECTION 3: EXPERIENCE QUALITY (Max 22)**
      +6 if experience section exists.
      +6 if roles have valid start/end dates.
      +6 if role titles and descriptions align logically with the identified domain.
      +4 if progression/promotion or increasing complexity is visible.

      **SECTION 4: EDUCATION VALIDATION (Max 15)**
      +5 if Degree explicitly stated.
      +5 if Institution explicitly stated.
      +5 if Field of Study is relevant to the identified domain.

      **SECTION 5: IMPACT & METRICS (Max 15)**
      +5 if 1-2 quantified bullets (%, $, scale, efficiency).
      +10 if 3+ quantified bullets.
      0 if no metrics.

      **SECTION 6: FORMATTING (Max 10)**
      +4 if standard headers used.
      +3 if single-column/clean layout.
      +3 if no tables/graphics/icons.

      **SECTION 7: PENALTIES**
      -5 for keyword stuffing (listing skills clearly irrelevant to the identified domain).
      -5 for missing dates.
      -5 if >2 pages.
      -10 for complex graphics/tables.

**FINAL CALCULATION:**
Sum Sections 1-6. Subtract Penalties. Clamp 0-100.
**OUTPUT FORMAT:**
Return ONLY valid JSON matching this structure:
{
"name": "string",
"resumeEmail": "string",
"phone": "string",
"location": "string",
"summary": "string",
"jobRoles": ["string"],
"skills": ["string"],
"experience": [{ "role": "string", "company": "string", "duration": "string", "desc": "string" }],
"education": [{ "degree": "string", "school": "string", "year": "string", "grade": "string" }],
"projects": [{ "title": "string", "tech": "string", "desc": "string", "link": "string" }],
"achievements": ["string"],
"certifications": ["string"],
"atsScore": number,
"links": { "github": "string", "linkedin": "string", "portfolio": "string" }

}

`; 
    const result = await model.generateContent([prompt, resumePart]);
    const extractedData = JSON.parse(result.response.text());

    let finalScore = 50;
    if (typeof extractedData.atsScore === 'number') {
      finalScore = extractedData.atsScore;
    } else if (typeof extractedData.atsScore === 'object' && extractedData.atsScore !== null) {
      finalScore = extractedData.atsScore.totalScore || extractedData.atsScore.score || 50;
    }

    const updateData = {
      name: extractedData.name,
      resumeEmail: extractedData.resumeEmail,
      phone: extractedData.phone,
      location: extractedData.location,
      summary: extractedData.summary,
      jobRoles: extractedData.jobRoles,
      skills: extractedData.skills,
      experience: extractedData.experience,
      education: extractedData.education,
      projects: extractedData.projects,
      achievements: extractedData.achievements,
      certifications: extractedData.certifications,
      atsScore: finalScore,
      links: extractedData.links
    };

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true }
      ).select('-password');
      
      // SYNC REDIS
      await syncCache(req.user.id, updatedUser);

      try { fs.unlinkSync(req.file.path); } catch(e) {}
      return res.json(updatedUser);

    } catch (dbError) {
      if (dbError.code === 11000) {
        delete updateData.resumeEmail;
        const retryUser = await User.findByIdAndUpdate(
          req.user.id,
          { $set: updateData },
          { new: true }
        ).select('-password');

        // SYNC REDIS ON RETRY
        await syncCache(req.user.id, retryUser);

        try { fs.unlinkSync(req.file.path); } catch(e) {}
        return res.json(retryUser);
      }
      throw dbError;
    }
  } catch (error) {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch(e) {}
    res.status(500).json({ message: "Failed to process resume" });
  }
};

module.exports = { getProfile, extractProfileFromResume, syncCache };