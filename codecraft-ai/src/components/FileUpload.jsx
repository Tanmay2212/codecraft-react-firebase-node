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

  const [department, setDepartment] = useState("HR");
  const [position, setPosition] = useState("Intern");
  const [topic, setTopic] = useState("Policies");

  if (!role || !["admin", "hr", "owner"].includes(role)) {
    return (
      <div className="text-red-500 text-center mt-10 text-lg">
        ⛔ Access Denied: Only Admins, HR, or Owner can upload documents.
      </div>
    );
  }

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let allText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          allText += strings + "\n\n";
        }

        if (!allText.trim()) {
          alert("❌ No readable text found. This may be a scanned document.");
          return;
        }

        setText(allText.trim());
      } catch (err) {
        alert("❌ PDF extraction failed.");
        console.error(err);
      }
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
    else {
      alert("❌ Only PDF or TXT files allowed.");
      setText("");
      setFileName("");
    }
  };

  const saveToFirestore = async () => {
    if (!text || !fileName) {
      alert("⚠️ Please select a file and ensure content is extracted.");
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, "company_docs"), {
        fileName,
        content: text,
        department: department.toLowerCase(),
        role: position.toLowerCase(),
        category: topic.toLowerCase(),
        createdAt: serverTimestamp(),
      });

      alert("✅ File saved successfully!");
      setText("");
      setFileName("");
    } catch (err) {
      console.error("❌ Firestore save error:", err);
      alert("❌ Failed to save file.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📤 Upload Company Document</h2>

      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="mb-3 block w-full" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 border rounded">
          <option value="">-- Department --</option>
          <option value="HR">HR</option>
          <option value="Tech">Tech</option>
          <option value="Support">Support</option>
        </select>

        <select value={position} onChange={(e) => setPosition(e.target.value)} className="p-2 border rounded">
          <option value="">-- Role --</option>
          <option value="Intern">Intern</option>
          <option value="Manager">Manager</option>
          <option value="Senior">Senior</option>
        </select>

        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="p-2 border rounded">
          <option value="">-- Topic --</option>
          <option value="Policies">Policies</option>
          <option value="Leaves">Leaves</option>
          <option value="Access">Access</option>
        </select>
      </div>

      {text && (
        <>
          <textarea
            value={text}
            readOnly
            rows={10}
            className="w-full border p-2 mb-4 bg-gray-100"
          />
          <button
            onClick={saveToFirestore}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "💾 Save to Firestore"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
