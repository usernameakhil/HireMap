const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/studentProfile'); // ENSURE this path is correct
const { syncCache } = require('./studentController'); // ENSURE this path is correct

exports.getPlatformRecommendations = async (req, res) => {
  const { country, cityState, jobRole, experience, workMode, jobType } = req.body;

  // 1. AUTHENTICATION GUARD
  // If req.user is missing, the route is not protected by 'protect' middleware
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Access denied. No user session found." });
  }

  const userId = req.user.id;
  const COST = 2;

  try {
    // 2. ATOMIC COIN DEDUCTION (MongoDB)
    // Only proceed if user has at least 5 coins
    const user = await User.findOneAndUpdate(
      { _id: userId, coins: { $gte: COST } },
      { $inc: { coins: -COST } },
      { new: true }
    );

    if (!user) {
      return res.status(403).json({ 
        message: `Insufficient Credits. Discovery requires ${COST} credits.` 
      });
    }

    // 3. SYNC REDIS IMMEDIATELY
    // Overwrites the cached profile so balance is correct on refresh
    await syncCache(userId, user);

    // 4. AI GENERATION
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      System: You are an Elite Career Intelligence Deep-Search Engine.
      Task: Find the top 8-10 job platforms in ${country} for ${cityState}.
      Context: ${jobType} role as a ${jobRole} with ${experience} experience. Work Mode: ${workMode}.

      Constraint: Construct 'Deep Links' leading directly to filtered results.
      
      Output strictly as a JSON array (no markdown, no backticks):
      [
        {
          "name": "Platform Name",
          "description": "Short explanation of relevance.",
          "directLink": "HTTPS_ENCODED_DEEP_LINK",
          "websiteUrl": "base domain"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean potential markdown and parse
    const jsonString = text.replace(/```json|```/g, "").trim();
    const platforms = JSON.parse(jsonString);

    const platformsWithLogos = platforms.map(p => ({
      ...p,
      logo: `https://www.google.com/s2/favicons?sz=128&domain=${p.websiteUrl}`
    }));

    // 5. SEND RESPONSE WITH UPDATED COINS
    // Returning updatedCoins allows the frontend to sync liveCoins state immediately
    res.status(200).json({ 
      platforms: platformsWithLogos,
      updatedCoins: user.coins 
    });

  } catch (error) {
    console.error("Discovery Logic Error:", error);
    res.status(500).json({ error: "AI Engine encountered a logic error constructing deep links." });
  }
};