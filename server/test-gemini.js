require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    console.log("----------------------------------------");
    console.log("🧪 Testing Gemini API with 'gemini-flash-latest'");
    console.log("----------------------------------------");

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ No API Key found");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Using 'gemini-flash-latest' which was found in the list
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log("⏳ Sending test prompt...");
        const result = await model.generateContent("Hello! Verify you are working.");
        const response = result.response.text();

        console.log("----------------------------------------");
        console.log("✅ SUCCESS! API Response:");
        console.log(response);
        console.log("----------------------------------------");

    } catch (error) {
        console.error("----------------------------------------");
        console.error("❌ FAILURE: API Call Failed");
        console.error("Error Message:", error.message);
        console.error("----------------------------------------");
    }
}

test();
