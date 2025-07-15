import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Container, Typography, Paper, Box, CircularProgress } from "@mui/material";

const Employee = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get("/employees/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployee(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch employee", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "employee") fetchEmployee();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5">No employee profile found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {employee.name}
        </Typography>
        <Typography variant="body1">Email: {user?.email}</Typography>
        <Typography variant="body1">Department: {employee.department}</Typography>
        <Typography variant="body1">Position: {employee.position}</Typography>
      </Paper>
    </Container>
  );
};

export default Employee;
