// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}!</h1>
      <button onClick={() => { logout(); navigate("/login"); }} className="mt-4 bg-red-500 text-white px-4 py-2">
        Logout
      </button>
    </div>
  );
}
