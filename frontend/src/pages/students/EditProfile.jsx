import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({ name: "", course: "", yearLevel: "" });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Container maxWidth="sm" sx={{ mt: { xs: 6, sm: 10 }, mb: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
          color="primary"
        >
          ✏️ Edit Profile
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            name="course"
            label="Course"
            value={form.course}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            name="yearLevel"
            label="Year Level"
            value={form.yearLevel}
            onChange={handleChange}
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            size={isMobile ? "medium" : "large"}
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile;
