require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testConnection() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const res = await model.generateContent("hello");
        console.log("Success: " + res.response.text());
    } catch (e) {
        console.log("Error: " + e.message);
    }
}

testConnection();
