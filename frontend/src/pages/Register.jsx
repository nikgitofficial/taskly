import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Extra fields for student role
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = { email, password, role };

    // Attach student-specific data if role is student
    if (role === "student") {
      payload.name = name;
      payload.course = course;
      payload.yearLevel = yearLevel;
    }

    try {
      await axios.post("/auth/register", payload);
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
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

          {/* 👇 Show these only for students */}
          {role === "student" && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
              <TextField
                fullWidth
                label="Course"
                variant="outlined"
                margin="normal"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required 
              />
              <TextField
                fullWidth
                label="Year Level"
                variant="outlined"
                margin="normal"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                required 
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
