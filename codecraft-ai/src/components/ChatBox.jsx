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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const [previewContent, setPreviewContent] = useState(null);
  const handlePreview = (fileName, content) =>
    setPreviewContent({ fileName, content });
  const closeModal = () => setPreviewContent(null);

  // Fetch recent messages
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
      const reply = await searchDocsAndAskGemini(input);

      const aiMsg = {
        role: "assistant",
        content: reply,
        createdAt: serverTimestamp(),
      };

      const chatRef = collection(db, "chats", user.uid, "messages");
      await addDoc(chatRef, userMsg);
      await addDoc(chatRef, aiMsg);

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("❌ Gemini error:", err);
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

  const renderMessage = (msg) => {
    if (msg.content.includes("📄 [") && msg.content.includes("]:")) {
      const matches = msg.content.matchAll(/\📄 \[(.*?)\]\(.*?\):\n([\s\S]*)/g);
      const result = Array.from(matches);
      return result.map(([_, fileName, content], idx) => (
        <p key={idx}>
          📄{" "}
          <span
            className="text-blue-700 underline cursor-pointer font-semibold"
            onClick={() => handlePreview(fileName, content)}
          >
            {fileName}
          </span>
          <br />
          {content}
        </p>
      ));
    } else {
      return <span>{msg.content}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 border bg-white shadow-xl rounded-xl">
      {/* Chat window */}
      <div className="h-[500px] overflow-y-auto px-4 py-2 space-y-4 bg-[#f5f8fc] rounded-md border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 text-sm max-w-[75%] whitespace-pre-wrap font-medium shadow-md ${
                msg.role === "user"
                  ? "bg-[#a3c9f9] text-black"
                  : "bg-[#e9e9f3] text-gray-800"
              }`}
            >
              {renderMessage(msg)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center italic text-gray-500">🤖 Gemini is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Ask something like 'What is the notice period for interns?'"
          className="w-full p-3 border rounded-md shadow-sm bg-white text-gray-800 focus:outline-blue-500"
          rows={3}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

      {/* File Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 h-3/4 overflow-y-auto p-6 rounded-lg shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-lg font-bold text-red-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">{previewContent.fileName}</h2>
            <pre className="text-gray-700 whitespace-pre-wrap text-sm">
              {previewContent.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
