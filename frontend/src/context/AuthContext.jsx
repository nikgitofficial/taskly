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
    const res = await axios.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setStudent(res.data.student || null);
    return res.data.user;
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    setStudent(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const refreshStudent = async () => {
    const res = await axios.get("/students/me");
    setStudent(res.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      axios.get("/auth/refresh").then(res => {
        localStorage.setItem("token", res.data.token);
        return axios.get("/auth/me");
      })
      .then(res => {
        setUser(res.data.user);
        return axios.get("/students/me");
      })
      .then(res => {
        setStudent(res.data);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
    } else {
      axios.get("/auth/me")
        .then(res => {
          setUser(res.data.user);
          return axios.get("/students/me");
        })
        .then(res => setStudent(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, student, login, logout, refreshStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
