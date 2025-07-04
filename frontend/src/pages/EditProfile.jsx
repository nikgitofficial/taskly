import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({ name: "", course: "", yearLevel: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: res.data.name || "",
        course: res.data.course || "",
        yearLevel: res.data.yearLevel || "",
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put("/student/me", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/student-dashboard");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          ✏️ Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="course"
            label="Course"
            value={form.course}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="yearLevel"
            label="Year Level"
            value={form.yearLevel}
            onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile;
