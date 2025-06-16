import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("tanmaysharma2000k@gmail.com");
  const [password, setPassword] = useState("123456");
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
      console.log("✅ Role is:", role);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/chat");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">Login to Company Assistant</h2>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96 space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
