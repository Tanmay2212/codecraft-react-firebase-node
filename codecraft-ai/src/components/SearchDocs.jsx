import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { askGeminiWithContext } from "../lib/gemini";

const SearchDocs = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);

  // 🧠 Fetch all company_docs from Firestore
  useEffect(() => {
    const fetchDocs = async () => {
      const snapshot = await getDocs(collection(db, "company_docs"));
      const data = snapshot.docs.map(doc => doc.data());
      setDocs(data);
    };
    fetchDocs();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    // 🔍 Find best match doc (basic keyword check)
    const matched = docs.find(doc =>
      doc.content.toLowerCase().includes(query.toLowerCase())
    );

    const context = matched ? matched.content.slice(0, 3000) : "No match found.";
    const prompt = `
You are a strict company AI assistant. Only use the info from below context to answer. If the answer is not in context, say "I don't have info on that."

Context:
${context}

Question: ${query}
`;

    const reply = await askGeminiWithContext(prompt);
    setResponse(reply);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">🤖 Ask Company Policy</h2>

      <textarea
        placeholder="e.g. What is the notice period for software engineers?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
        className="w-full border rounded p-2"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>

      {response && (
        <div className="mt-4 p-4 bg-green-100 border rounded whitespace-pre-wrap">
          <strong>🧠 Gemini says:</strong>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
};

export default SearchDocs;
