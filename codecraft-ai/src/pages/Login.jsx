// src/pages/Login.jsx
import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
  await signInWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, "users", auth.currentUser.uid);
  const snap = await getDoc(userRef);

  const role = snap.exists() ? snap.data().role : "employee";

  // ✅ Redirect based on role
  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/chat");
  }

} catch (err) {
  console.error("❌ Login failed:", err);
  setError("Invalid credentials.");
}}


  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
