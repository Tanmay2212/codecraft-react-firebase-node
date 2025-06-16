import axios from "axios";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function askGeminiWithContext(prompt) {
  try {
    const res = await axios.post(
      `${GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No reply.";
  } catch (error) {
    console.error("❌ Gemini API error:", error.response || error.message);
    return "❌ Gemini error or no response.";
  }
}
