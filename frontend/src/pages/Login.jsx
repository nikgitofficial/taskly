import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      const user = await login(email, password);

      if (user?.role === "student") {
        navigate("/student-dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user?.role === "work") {
        navigate("/work-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          type="email"
          required
        />

        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
          required
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
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>

      <Typography align="center" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
          Register
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
