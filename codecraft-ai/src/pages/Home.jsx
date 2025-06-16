import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role) {
      role === "admin" ? navigate("/admin") : navigate("/chat");
    }
  }, [user, role]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Company Assistant</h1>
      <p className="mt-4">Please login to continue.</p>
    </div>
  );
};

export default Home;
