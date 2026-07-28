const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/studentProfile"); // Ensure this path is correct
const { syncCache } = require('./studentController'); // Imported syncCache helper

// Ensure .env has GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Convert local file to Gemini-compatible format
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// --- 1. DEEP RESUME ANALYSIS (PDF) ---
const analyzeResumeDeeply = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded." });
    }

    const userId = req.user.id;
    const COST = 2;

    // --- ATOMIC COIN DEDUCTION LOGIC ---
    // Only proceed if user has at least 5 coins
    const user = await User.findOneAndUpdate(
      { _id: userId, coins: { $gte: COST } },
      { $inc: { coins: -COST } },
      { new: true }
    );

    if (!user) {
        if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
        return res.status(403).json({ 
          message: `Insufficient coins. Analysis requires ${COST} credits.` 
        });
    }

    // SYNC REDIS IMMEDIATELY
    await syncCache(userId, user);

    const resumePart = fileToGenerativePart(req.file.path, "application/pdf");

    // Using gemini-1.5-flash as it is the stable production-ready model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        temperature: 0, 
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are a strict and deterministic Resume Parser. 
      Analyze the **attached PDF resume**.
      
      **TASK 1: ANALYZE CONTEXT (Internal)**
      Before scoring, mentally extract the candidate's key details (Summary, Skills, Experience) to ensure deep understanding.
      
      **TASK 2: ATS SCORING RUBRIC (Strict Math)**
      You are a deterministic ATS Scoring Engine & Auditor.
      
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
      **TASK 2: DEEP ANALYSIS & FEEDBACK**
      1. **Summary:** A professional 2-sentence summary.
      2. **Critical Issues:** Why were points lost? (Be specific).
      3. **Positive Points:** What was done well?
      4. **Deep Improvements:** Actionable advice to reach 100/100.
      5. **Missing Keywords:** Identify 5-7 technical keywords missing **for the identified domain**.

      **OUTPUT FORMAT:**
      Return ONLY valid JSON matching this structure:
      {
        "atsScore": Number,
        "summary": "String",
        "criticalIssues": ["String"],
        "positivePoints": ["String"],
        "deepImprovements": ["String"],
        "keywordsMissing": ["String"]
      }
    `;

    const result = await model.generateContent([prompt, resumePart]);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysisData = JSON.parse(cleanJson);

    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {} 

    // Include updatedCoins in the response so the frontend can sync
    res.json({
        ...analysisData,
        updatedCoins: user.coins
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.status(500).json({ message: "Analysis failed: " + error.message });
  }
};

// --- 2. CHAT WITH AI AGENT ---
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body; 

    if (!message) return res.status(400).json({ message: "Message is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chatPrompt = `
      You are an expert Career Coach and Resume Consultant.
      
      **USER CONTEXT:**
      The user has just analyzed their resume. Here is the summary of their analysis:
      "${context ? JSON.stringify(context).slice(0, 2000) : 'No specific resume context provided.'}"

      **USER QUESTION:**
      "${message}"

      **YOUR GOAL:**
      Answer the question very concisely, professionally, and provide actionable advice based on the context provided. 
      Keep the tone encouraging but realistic. 
      Refuse to answer non-career/non-resume related questions.
    `;

    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Chat failed: " + error.message });
  }
};

module.exports = { analyzeResumeDeeply, chatWithAI };