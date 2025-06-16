// src/components/FileUpload.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as pdfjsLib from "pdfjs-dist";
import { useAuth } from "../context/AuthContext";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUpload = () => {
  const { role } = useAuth();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);

  const [department, setDepartment] = useState("");
  const [docRole, setDocRole] = useState("");
  const [category, setCategory] = useState("");

  if (!role || !["admin", "hr", "owner"].includes(role)) {
    return (
      <div className="text-red-500 text-center mt-10 text-lg">
        ⛔ Access Denied: Only admins/HR can upload documents.
      </div>
    );
  }

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let allText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).join(" ");
        allText += strings + "\n\n";
      }
      setText(allText.trim());
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromTXT = async (file) => {
    const reader = new FileReader();
    reader.onload = () => setText(reader.result.trim());
    reader.readAsText(file);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    if (file.type === "application/pdf") await extractTextFromPDF(file);
    else if (file.type === "text/plain") await extractTextFromTXT(file);
    else alert("❌ Only PDF or TXT files are allowed.");
  };

  const saveToFirestore = async () => {
    if (!text || !fileName) return alert("⚠️ No content to save.");
    try {
      setSaving(true);
      await addDoc(collection(db, "company_docs"), {
        fileName,
        content: text,
        department,
        role: docRole,
        category,
        createdAt: serverTimestamp(),
      });
      alert("✅ Saved to Firestore!");
      setText("");
      setFileName("");
      setDepartment("");
      setDocRole("");
      setCategory("");
    } catch (err) {
      console.error("🔥 Firestore error:", err);
      alert("❌ Firestore save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📤 Upload Company Doc</h2>
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="mb-4" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department (e.g. HR)" className="p-2 border rounded" />
        <input value={docRole} onChange={(e) => setDocRole(e.target.value)} placeholder="Role (e.g. Intern)" className="p-2 border rounded" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. Benefits)" className="p-2 border rounded" />
      </div>

      {text && (
        <>
          <textarea value={text} readOnly rows={10} className="w-full border p-2 mb-4 bg-gray-100" />
          <button
            onClick={saveToFirestore}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save to Firestore"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
