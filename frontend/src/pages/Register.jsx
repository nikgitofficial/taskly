// src/pages/Register.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true if screen <600px

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { email, password, role };

    if (role === "student") {
      payload.name = name;
      payload.course = course;
      payload.yearLevel = yearLevel;
    }

    try {
      await axios.post("/auth/register", payload);
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
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
      <Paper
        elevation={4}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 480,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
        >
          Register
        </Typography>

        {/* Only show intro on non-mobile */}
        {!isMobile && (
          <Typography variant="body2" align="center" color="text.secondary" mb={2}>
            Create an account to access Taskly’s dashboard based on your role.
          </Typography>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="work">Work</MenuItem>
            </Select>
          </FormControl>

          {role === "student" && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Course"
                margin="normal"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
              <TextField
                fullWidth
                label="Year Level"
                margin="normal"
                required
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              />
            </>
          )}

          {error && (
            <Typography color="error" variant="body2" align="center" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.5 }}
          >
            Register
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
