import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Logout Component - outside main component
const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
      Logout
    </button>
  );
};

const AdminDashboard = () => {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const snapshot = await getDocs(collection(db, "company_docs"));
    const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDocs(files);
  };

  const deleteFile = async (id) => {
    await deleteDoc(doc(db, "company_docs", id));
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📁 Uploaded Files</h2>
        <Logout /> {/* ✅ This is where we show the logout button */}
      </div>
      <ul className="space-y-2">
        {docs.map((file) => (
          <li key={file.id} className="border p-2 rounded flex justify-between items-center">
            <span>{file.fileName}</span>
            <button
              onClick={() => deleteFile(file.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
