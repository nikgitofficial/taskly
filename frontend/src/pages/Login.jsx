import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Avatar,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../assets/logo.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      setSnackOpen(true);

      setTimeout(() => {
        if (user?.role === "student") navigate("/student-dashboard");
        else if (user?.role === "admin") navigate("/admin-dashboard");
        else if (user?.role === "work") navigate("/work-dashboard");
        else if (user?.role === "employee") navigate("/employee-home");
        else navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            zIndex: 9999,
          }}
        >
          <Box sx={{ position: "relative", width: 80, height: 80, mb: 2 }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{ color: "#1976d2", position: "absolute", top: 0, left: 0 }}
            />
            <Avatar
              src={logo}
              alt="logo"
              sx={{
                width: 40,
                height: 40,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
              }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Logging in...
          </Typography>
        </Box>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            mt: { xs: 4, md: 10 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 420 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography color="error" variant="body2" align="center" mt={1}>
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.5 }}
              >
                Login
              </Button>
            </Box>

            <Typography align="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
                Register
              </Link>
            </Typography>
          </Paper>
        </Container>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message="Login successful"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default Login;
