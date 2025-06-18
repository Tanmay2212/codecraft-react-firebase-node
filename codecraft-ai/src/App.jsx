import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { auth } from "./firebase";

// Components & Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChatBox from "./components/ChatBox";
import FileUpload from "./components/FileUpload";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";

// Route Guards
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const { user, permissions } = useAuth();

  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-100 shadow">
        <div className="text-lg font-bold text-blue-800">🚀 Company Assistant</div>
        <div className="flex items-center gap-4">
          {user && <Link to="/chat" className="hover:underline">Chat</Link>}
          {permissions?.canUpload && (
  <Link to="/upload" className="hover:underline">Upload</Link>
)}
          {permissions?.canViewDashboard && (
  <Link to="/admin" className="hover:underline">Dashboard</Link>
)}
          {user && <button onClick={() => auth.signOut()} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/chat" element={<PrivateRoute><ChatBox /></PrivateRoute>} />

        <Route path="/upload" element={
          <AdminRoute>
            <AdminLayout><FileUpload /></AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
