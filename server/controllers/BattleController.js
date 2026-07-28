const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure .env has GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Convert file to Gemini-compatible format
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// --- RESUME BATTLE LOGIC ---
const compareResumes = async (req, res) => {
  try {
    // Check if both files exist
    if (!req.files || !req.files['resumeA'] || !req.files['resumeB']) {
      return res.status(400).json({ message: "Both Resume A and Resume B are required for battle." });
    }

    // 1. Prepare Files
    const resumeA = fileToGenerativePart(req.files['resumeA'][0].path, "application/pdf");
    const resumeB = fileToGenerativePart(req.files['resumeB'][0].path, "application/pdf");

    // 2. Configure Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        temperature: 0.2,
        topP: 1,
        responseMimeType: "application/json",
      }
    });

    // 3. The Battle Prompt
    const prompt = `
      You are an elite Hiring Manager and Resume Judge. You are comparing two candidates for a high-paying tech role.
      
      **INPUTS:**
      - **Resume A:** (First attached PDF)
      - **Resume B:** (Second attached PDF)

      **YOUR MISSION:**
      Analyze both resumes deeply. Compare them head-to-head.

      **THE VERDICT:**
      Declare a clear **WINNER**. 
      
      **OUTPUT FORMAT:**
      Return ONLY valid JSON:
      {
        "winner": "Resume A" or "Resume B",
        "scores": {
          "resumeA": Number (0-100),
          "resumeB": Number (0-100)
        },
        "winnerReason": "A sharp, 1-sentence punchline on why they won.",
        "loserReason": "A brutal but honest 1-sentence reason why they lost.",
        "comparison": {
          "impact": "String comparing their use of metrics",
          "skills": "String comparing their technical depth",
          "formatting": "String comparing their layout"
        },
        "improvementPlan": [
          "Specific advice for the LOSER to beat the WINNER next time",
          "Specific advice 2",
          "Specific advice 3"
        ]
      }
    `;

    // 4. Generate Content
    const result = await model.generateContent([prompt, resumeA, resumeB]);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysisData = JSON.parse(cleanJson);

    // 5. Cleanup Files
    try {
      fs.unlinkSync(req.files['resumeA'][0].path);
      fs.unlinkSync(req.files['resumeB'][0].path);
    } catch (e) {}

    res.json(analysisData);

  } catch (error) {
    console.error("Battle Error:", error);
    if (req.files) {
      if (req.files['resumeA']) try { fs.unlinkSync(req.files['resumeA'][0].path); } catch (e) {}
      if (req.files['resumeB']) try { fs.unlinkSync(req.files['resumeB'][0].path); } catch (e) {}
    }
    res.status(500).json({ message: "Battle failed: " + error.message });
  }
};

// --- EXPORT ONLY COMPARE RESUMES ---
module.exports = { compareResumes };