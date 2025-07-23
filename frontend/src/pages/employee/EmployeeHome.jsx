// src/pages/employee/EmployeeHome.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Assignment,
  AccountCircle,
  BarChart,
  Folder,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const EmployeeHome = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get("/employees-profile/profile", {
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

  const cards = [
    {
      icon: <Assignment sx={{ fontSize: 40, color: "#ffffff" }} />,
      title: "Create Entry",
      description: "Submit your daily work logs easily.",
      bgColor: "linear-gradient(135deg, #4FC3F7, #1976D2)",
      action: () => navigate("/employee-create-entry"),
    },
    {
      icon: <AccountCircle sx={{ fontSize: 40, color: "#ffffff" }} />,
      title: "My Profile",
      description: "View and update your employee profile information.",
      bgColor: "linear-gradient(135deg, #81C784, #388E3C)",
      action: () => navigate("/employee-profile"),
    },
    {
      icon: <BarChart sx={{ fontSize: 40, color: "#ffffff" }} />,
      title: "Dashboard",
      description: "Track your work submissions and reports.",
      bgColor: "linear-gradient(135deg, #FFB74D, #F57C00)",
      action: () => navigate("/employee-dashboard"),
    },
    {
      icon: <Folder sx={{ fontSize: 40, color: "#ffffff" }} />,
      title: "My Files",
      description: "Manage and access your uploaded documents.",
      bgColor: "linear-gradient(135deg, #BA68C8, #8E24AA)",
      action: () => navigate("/employee-file"),
    },
  ];

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
    <Container sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #4FC3F7, #1976D2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome, {employee.name} 👋
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Manage your records, profile, and track your work performance — all in
          one place with a modern dashboard.
        </Typography>
      </Box>

      <Grid container spacing={9}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              elevation={0}
              onClick={card.action}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                height: "100%",
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  background: card.bgColor,
                  borderRadius: "50%",
                  padding: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {card.icon}
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                textAlign="center"
                mb={1}
              >
                {card.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mb={2}
              >
                {card.description}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 3,
                  background: card.bgColor,
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": {
                    background: card.bgColor,
                    opacity: 0.9,
                  },
                }}
              >
                Go to {card.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EmployeeHome;
