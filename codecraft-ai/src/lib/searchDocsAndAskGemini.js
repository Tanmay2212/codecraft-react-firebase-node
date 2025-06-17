// src/lib/searchDocsAndAskGemini.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { askGeminiWithContext } from "./gemini";
import Fuse from "fuse.js";

export async function searchDocsAndAskGemini(userQuery) {
  try {
    const snapshot = await getDocs(collection(db, "company_docs"));
    const docs = snapshot.docs.map((doc) => ({
      fileName: doc.data().fileName || "Unnamed",
      content: doc.data().content || "",
    }));

    if (!docs.length) return "❌ No documents available.";

    // 🔍 Fuzzy match but wider search (lenient threshold)
    const fuse = new Fuse(docs, {
      keys: ["content"],
      threshold: 0.5, // was 0.3 — more relaxed
      includeScore: true,
    });

    const result = fuse.search(userQuery);

    // Even if Fuse returns nothing, we fallback to all docs
    const matchedDocs = result.length > 0
      ? result.map((r) => r.item)
      : docs.slice(0, 5); // fallback to first 5 docs if none match

    // 🧠 Prepare prompt
    const combined = matchedDocs
      .map(
        (doc) => `📄 File: ${doc.fileName}\n${doc.content}`
      )
      .join("\n\n---\n\n");

    const prompt = `
You are a company policy assistant. Use ONLY the following document data to answer. 
Include file name in your response. If answer is not found, reply:
"I'm sorry, this is not documented."

Documents:
${combined}

User Question: ${userQuery}
    `;

    const reply = await askGeminiWithContext(prompt);
    return reply;
  } catch (err) {
    console.error("🔥 Error searching Gemini:", err);
    return "❌ Gemini failed to respond.";
  }
}
