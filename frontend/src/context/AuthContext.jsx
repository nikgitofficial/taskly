import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    setUser(res.data.user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    return res.data.user;
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.get("/auth/refresh");
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        const userRes = await axios.get("/auth/me");
        setUser(userRes.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
