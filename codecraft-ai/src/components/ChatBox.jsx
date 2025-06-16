// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { searchDocsAndAskGemini } from "../lib/searchDocsAndAskGemini";

function ChatBox() {
    const [selectedDept, setSelectedDept] = useState("HR");
    const [selectedRole, setSelectedRole] = useState("intern");
    const [selectedCategory, setSelectedCategory] = useState("policies");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const { user } = useAuth();

  // 🧠 Fetch previous messages (only within 2 days)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const chatRef = collection(db, "chats", user.uid, "messages");
      const q = query(chatRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const now = Timestamp.now();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

      const filtered = snapshot.docs
        .map((doc) => doc.data())
        .filter((msg) => {
          const createdAt = msg.createdAt?.toMillis?.() || 0;
          return now.toMillis() - createdAt <= twoDaysMs;
        });

      setMessages(filtered);
    };

    fetchMessages();
  }, [user]);

  // ✉️ Send user message + get Gemini reply
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input,
      createdAt: serverTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const replyText = await searchDocsAndAskGemini(input, {
        department: selectedDept,
        role: selectedRole,
        category: selectedCategory,
      });

      const aiMsg = {
        role: "assistant",
        content: replyText,
        createdAt: serverTimestamp(),
      };

      const chatRef = collection(db, "chats", user.uid, "messages");
      await addDoc(chatRef, userMsg);
      await addDoc(chatRef, aiMsg);

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("❌ Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Gemini couldn't respond." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 border rounded-lg shadow-md bg-white">
      <div className="h-[500px] overflow-y-auto space-y-4 px-4 py-2 bg-gray-50 border rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-line p-3 rounded-lg max-w-[75%] text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white text-right"
                : "mr-auto bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">Assistant is typing...</div>}
        <div ref={bottomRef} />
      </div>
    <p className="text-sm text-gray-600 mb-2">
  Select filters to help the assistant understand what kind of documents to look into.
    </p>

    <h3 className="text-md font-semibold mb-2">🔍 What do you want to ask about?</h3>
<div className="flex gap-4 mb-4">
  <div>
    <label className="block text-sm font-medium mb-1">Department</label>
    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="p-2 border rounded">
      <option value="HR">HR</option>
      <option value="Tech">Tech</option>
      <option value="Support">Support</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Role</label>
    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="p-2 border rounded">
      <option value="intern">Intern</option>
      <option value="manager">Manager</option>
      <option value="senior">Senior</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Category</label>
    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded">
      <option value="policies">Policies</option>
      <option value="leaves">Leaves</option>
      <option value="access">Access</option>
    </select>
  </div>
</div>




      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Type your question..."
        className="w-full mt-4 p-3 border rounded-md shadow-sm focus:outline-blue-500"
        rows={3}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-2 px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}

export default ChatBox;
