// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅ Added this
import { auth } from "./firebase";

// Pages & Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";
import AdminDashboard from "./pages/AdminDashboard";

// Wrappers
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const { user, role } = useAuth(); // ✅ Added this

  return (
    <BrowserRouter>
      {user && (
        <nav className="flex justify-between p-4 bg-gray-100 shadow">
          <div className="font-bold">🚀 Company Assistant</div>
          <div className="space-x-4">
            <Link to="/">Home</Link>
            <Link to="/chat">Chat</Link>
            {role === "admin" && (
              <>
                <Link to="/upload">Upload</Link>
                <Link to="/admin">Admin</Link>
              </>
            )}
            <span className="text-gray-600 ml-2">👤 {role}</span>
            <button
              onClick={() => auth.signOut()}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatBox />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <AdminRoute>
              <FileUpload />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
