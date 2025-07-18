import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    if (res.data.user.role === "student") {
      setStudent(res.data.student || null);
    } else if (res.data.user.role === "employee") {
      setEmployee(res.data.employee || null);
    }

    return res.data.user;
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error ignored:", err);
    }
    localStorage.removeItem("token");
    setUser(null);
    setStudent(null);
    setEmployee(null);
    navigate("/login");
  };

  const refreshStudent = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get("/students-profile/profile");
      setStudent(res.data);
    } catch (err) {
      console.error("❌ Failed to refresh student:", err);
      setStudent(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshEmployee = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get("/employees/me");
      setEmployee(res.data);
    } catch (err) {
      console.error("❌ Failed to refresh employee:", err);
      setEmployee(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const refreshRes = await axios.get("/auth/refresh");
        localStorage.setItem("token", refreshRes.data.token);

        const userRes = await axios.get("/auth/me");
        setUser(userRes.data);

        if (userRes.data.role === "student") {
          await refreshStudent();
        } else if (userRes.data.role === "employee") {
          await refreshEmployee();
        } else {
          setStudent(null);
          setEmployee(null);
        }
      } catch (err) {
        console.error("❌ Auth error:", err);
        setUser(null);
        setStudent(null);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [refreshStudent, refreshEmployee]);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        fontSize: "1.5rem",
      }}>
        <CircularProgress size={60} />
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        employee,
        loading: profileLoading,
        login,
        logout,
        refreshStudent,
        refreshEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
