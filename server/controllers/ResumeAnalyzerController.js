const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

const ResumeAnalyzer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded." });
    }

    // 1. Prepare File (Direct PDF)
    const resumePart = fileToGenerativePart(req.file.path, "application/pdf");

    // 2. Configure Model (FIXED: Use 1.5-pro for reasoning, 2.5 doesn't exist)
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

      **TASK 3: IMPROVEMENT SUGGESTIONS (Dynamic)**
      Identify 4-5 specific items to help the candidate improve their score based on the rubric above and their specific domain.
      - "critical": Missing contact info, missing sections, or very low word count.
      - "warning": Lack of "Hard Skills" relevant to the domain, vague descriptions, or no metrics (numbers).
      - "good": A specific strong point found (e.g., "Good use of Python" or "Clear Nursing credentials").
      - "info": General advice relevant to their specific role.

      **OUTPUT FORMAT:**
      Return ONLY a valid JSON object matching this structure:
      {
        "score": Number (0-100)
      }
    `;

    // 4. Generate Content
    const result = await model.generateContent([prompt, resumePart]);
    const response = await result.response;
    const text = response.text();

    // 5. Parse JSON
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysisData = JSON.parse(cleanJson);

    // 6. Cleanup File
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    // 7. Send Response
    res.json({
      success: true,
      fileName: req.file.originalname,
      ...analysisData
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.status(500).json({ message: "Analysis failed: " + error.message });
  }
};

module.exports = { ResumeAnalyzer };