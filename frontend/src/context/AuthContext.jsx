import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Skeleton, Typography, Box } from "@mui/material";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  // Ensure axios sends cookies with requests (needed for refresh token)
  axios.defaults.withCredentials = true;

  // On initial load → set token to Axios if exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data.user);

    if (res.data.user.role === "student") {
      setStudent(res.data.student || null);
    } else if (res.data.user.role === "employee") {
      setEmployee(res.data.employee || null);
    } else if (res.data.user.role === "admin") {
      setAdmin(res.data.admin || null);
    }

    return res.data.user;
  };

  const refreshAdmin = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get("/admin/profile");
      setAdmin(res.data);
    } catch (err) {
      console.error("❌ Failed to refresh admin:", err);
      setAdmin(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error ignored:", err);
    }
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setStudent(null);
    setEmployee(null);
    setAdmin(null);
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
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Try to get user info with the current token
        const userRes = await axios.get("/auth/me");
        setUser(userRes.data);

        if (userRes.data.role === "student") {
          await refreshStudent();
        } else if (userRes.data.role === "employee") {
          await refreshEmployee();
        } else if (userRes.data.role === "admin") {
          await refreshAdmin();
        } else {
          setStudent(null);
          setEmployee(null);
          setAdmin(null);
        }
      } catch (err) {
        console.error("❌ Auth error:", err);
        setUser(null);
        setStudent(null);
        setEmployee(null);
        setAdmin(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [refreshStudent, refreshEmployee, refreshAdmin]);

  if (loading) {
    return (
      <Box sx={{ padding: 2, maxWidth: 400, margin: "auto", marginTop: 8 }}>
        <Typography variant="h6" gutterBottom>
          Loading  please wait...
        </Typography>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        student,
        employee,
        loading: profileLoading,
        login,
        logout,
        refreshStudent,
        refreshEmployee,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
