// src/lib/searchDocsAndAskGemini.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { askGeminiWithContext } from "./gemini";

/**
 * Search Firestore for relevant docs and query Gemini.
 * @param {string} userQuery - The user's question.
 * @param {object} filters - Optional filters { role, department, category }.
 */
export async function searchDocsAndAskGemini(userQuery, filters = {}) {
  try {
    const snapshot = await getDocs(collection(db, "company_docs"));
    let matchedDocs = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const matches =
        (!filters.role || data.role?.toLowerCase().includes(filters.role.toLowerCase())) &&
        (!filters.department || data.department?.toLowerCase().includes(filters.department.toLowerCase())) &&
        (!filters.category || data.category?.toLowerCase().includes(filters.category.toLowerCase()));

      if (matches && data.content) {
        matchedDocs.push(data.content);
      }
    });

    if (matchedDocs.length === 0) {
      return "❌ Sorry, this is not documented.";
    }

    const combinedText = matchedDocs.join("\n\n---\n\n");

    const prompt = `You are a company policy assistant. You can only answer based on the documents provided below. 
If the answer is not available in the docs, respond strictly with: "I'm sorry, this is not documented."

Documents:
${combinedText}

User question: ${userQuery}`;

    const reply = await askGeminiWithContext(prompt);
    return reply;
  } catch (err) {
    console.error("🔥 Firestore + Gemini error:", err);
    return "❌ Error searching documents.";
  }
}
