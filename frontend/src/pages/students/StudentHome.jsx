// src/pages/student/StudentHome.jsx
import React from "react";
import { Container, Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Assignment, AccountCircle, BarChart, Folder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <Assignment sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Create Entry",
      description: "Submit your student daily logs quickly.",
      action: () => navigate("/student-entry"),
    },
    {
      icon: <AccountCircle sx={{ fontSize: 40, color: "#388e3c" }} />,
      title: "My Profile",
      description: "View and update your student profile information.",
      action: () => navigate("/student-profile"),
    },
    {
      icon: <BarChart sx={{ fontSize: 40, color: "#f57c00" }} />,
      title: "Dashboard",
      description: "Track your submissions and activities.",
      action: () => navigate("/student-dashboard"),
    },
    {
      icon: <Folder sx={{ fontSize: 40, color: "#7b1fa2" }} />,
      title: "My Files",
      description: "Manage and access your uploaded files.",
      action: () => navigate("/student-files"),
    },
  ];

  return (
    <Container sx={{ mt: 8 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome, Student 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Easily manage your records and track your progress here.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 4,
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              {card.icon}
              <Typography variant="h5" fontWeight={600} mt={2} gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                {card.description}
              </Typography>
              <Button variant="contained" fullWidth onClick={card.action} sx={{ borderRadius: 3 }}>
                Go to {card.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentHome;
