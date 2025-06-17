// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const Logout = () => (
  <button
    onClick={() => {
      signOut(auth);
      window.location.href = "/";
    }}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  >
    Logout
  </button>
);

const AdminDashboard = () => {
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔽 Get all uploaded files
  const fetchDocs = async () => {
    const snapshot = await getDocs(collection(db, "company_docs"));
    const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDocs(files);
  };

  // 🔽 Get all registered users
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const usersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersList);
  };

  const deleteFile = async (id) => {
    await deleteDoc(doc(db, "company_docs", id));
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛠 Admin Dashboard</h2>
        <Logout />
      </div>

      {/* 👤 Users */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-3">👥 Users List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-4">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{user.name || "N/A"}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border capitalize">{user.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📁 Documents */}
      <div>
        <h3 className="text-xl font-semibold mb-3">📁 Uploaded Files</h3>
        {docs.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">File Name</th>
                  <th className="p-2 border">Dept</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{file.fileName}</td>
                    <td className="p-2 border">{file.department}</td>
                    <td className="p-2 border">{file.role}</td>
                    <td className="p-2 border">{file.category}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
