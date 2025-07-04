import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios"; // Make sure this has the interceptor
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

      setUser(res.data.user);
      setStudent(res.data.student || null);
      localStorage.setItem("token", res.data.token);

      return res.data.user;
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const refreshStudent = async () => {
    try {
      const res = await axios.get("/students/me");
      setStudent(res.data);
    } catch (err) {
      console.error("❌ Failed to refresh student:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user || res.data);
          return axios.get("/students/me");
        })
        .then((res) => {
          setStudent(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>; // ✅ Prevents flicker during session restore

  return (
    <AuthContext.Provider value={{ user, student, login, logout, refreshStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
