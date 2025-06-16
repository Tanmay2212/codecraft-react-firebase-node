// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (role !== "admin" && role !== "hr" && role !== "owner")
    return <div className="text-red-500 text-center mt-10">⛔ Access Denied</div>;

  return children;
};

export default AdminRoute;
