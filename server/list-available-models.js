const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listMyModels() {
  console.log("📡 Connecting to Google to fetch YOUR available models...");
  
  try {
    // This is a direct API call to see what you actually own access to
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.models) {
      console.log("❌ No models found. Your API Key might be restricted.");
      return;
    }

    console.log("\n✅ SUCCESS! You have access to these models:");
    console.log("------------------------------------------------");
    
    // Filter for models that support "generateContent"
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(m => {
      // We only care about the part after "models/"
      console.log(`Model Name: "${m.name.replace('models/', '')}"`);
    });
    
    console.log("------------------------------------------------");
    console.log("👉 Pick one of the names above and put it in your profileController.js");

  } catch (error) {
    console.error("FAILED:", error.message);
  }
}

listMyModels();