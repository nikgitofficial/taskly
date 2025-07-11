// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setStudent(res.data.student || null);
      return res.data.user;
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed");
    }
    localStorage.removeItem("token");
    setUser(null);
    setStudent(null);
    navigate("/login");
  };

  const refreshStudent = async () => {
    try {
      const res = await axios.get("/students/me");
      setStudent(res.data);
    } catch (err) {
      console.error("Failed to refresh student:", err);
    }
  };

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const refreshRes = await axios.get("/auth/refresh");
        localStorage.setItem("token", refreshRes.data.token);

        const userRes = await axios.get("/auth/me");
        setUser(userRes.data);

        if (userRes.data.role === "student") {
          const studentRes = await axios.get("/students/me");
          setStudent(studentRes.data);
        }
      } catch (err) {
        console.error("❌ Auth error:", err.message || err);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem" }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, student, login, logout, refreshStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
