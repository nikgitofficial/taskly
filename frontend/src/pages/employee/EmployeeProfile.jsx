import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Button,
} from "@mui/material";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployeeProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/employees/me");
      setEmployee(response.data);
    } catch (err) {
      console.error("❌ Employee profile fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch employee profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Employee Profile
        </Typography>
        <Typography variant="body1"><strong>Name:</strong> {employee?.name}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {employee?.email}</Typography>
        <Typography variant="body1"><strong>Department:</strong> {employee?.department}</Typography>
        <Typography variant="body1"><strong>Position:</strong> {employee?.position}</Typography>

        <Box mt={3}>
          <Button variant="outlined" onClick={fetchEmployeeProfile}>
            Refresh
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeProfile;
