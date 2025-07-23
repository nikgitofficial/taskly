import { useState, useEffect } from "react";
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
  CircularProgress,
  LinearProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ label: "", color: "" });

  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (pwd.length === 0) {
      setPasswordStrength({ label: "", color: "" });
      setPasswordError("");
      return;
    }

    if (score <= 1) {
      setPasswordStrength({ label: "Weak", color: "#d32f2f" });
      setPasswordError("Password is too weak");
    } else if (score === 2 || score === 3) {
      setPasswordStrength({ label: "Medium", color: "#ed6c02" });
      setPasswordError("");
    } else if (score === 4) {
      setPasswordStrength({ label: "Strong", color: "#2e7d32" });
      setPasswordError("");
    }
  };

  useEffect(() => {
    evaluatePasswordStrength(password);
  }, [password]);

  const getPasswordProgressValue = (label) => {
    switch (label) {
      case "Weak":
        return 33;
      case "Medium":
        return 66;
      case "Strong":
        return 100;
      default:
        return 0;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordError) {
      setError("Please fix password errors before submitting.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const payload = { email, password, role };

    if (role === "student") {
      payload.name = name;
      payload.course = course;
      payload.yearLevel = yearLevel;
    } else if (role === "employee") {
      payload.name = name;
      payload.department = department;
      payload.position = position;
    }

    try {
      await axios.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
      <Paper elevation={4} sx={{ p: isMobile ? 2 : 4, borderRadius: 3, width: "100%", maxWidth: 480 }}>
        <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(passwordError)}
            helperText={passwordError || "At least 8 chars, uppercase, number & symbol recommended."}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {password && (
            <>
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordProgressValue(passwordStrength.label)}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: passwordStrength.color || "#1976d2",
                      transition: "width 0.5s ease-in-out",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: passwordStrength.color,
                  fontWeight: "bold",
                  mt: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {passwordStrength.label} Password
              </Typography>
            </>
          )}

          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && password !== confirmPassword}
            helperText={confirmPassword && password !== confirmPassword ? "Passwords do not match." : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
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

          {role === "employee" && (
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
                label="Department"
                margin="normal"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                fullWidth
                label="Position"
                margin="normal"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </>
          )}

          {error && (
            <Typography color="error" variant="body2" align="center" mt={1}>
              {error}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
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
