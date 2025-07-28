// EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import axios from "../../api/axios";
import {
  Container, Typography, Card, Grid, Button, Avatar, Box, Fade, useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import EventIcon from "@mui/icons-material/Event";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const iconMap = {
  Task: <TaskIcon fontSize="large" sx={{ color: "#fff" }} />,
  "Project Update": <AssignmentIcon fontSize="large" sx={{ color: "#fff" }} />,
  Meeting: <EventIcon fontSize="large" sx={{ color: "#fff" }} />,
  Training: <EventIcon fontSize="large" sx={{ color: "#fff" }} />,
  Event: <EventIcon fontSize="large" sx={{ color: "#fff" }} />,
  "Leave Request": <AccessTimeIcon fontSize="large" sx={{ color: "#fff" }} />,
  "Incident Report": <ListAltIcon fontSize="large" sx={{ color: "#fff" }} />,
  "Daily Log": <ListAltIcon fontSize="large" sx={{ color: "#fff" }} />,
  "Idea/Suggestion": <AssignmentIcon fontSize="large" sx={{ color: "#fff" }} />,
};

const bgMap = {
  Task: "linear-gradient(135deg, #66bb6a, #43a047)",
  "Project Update": "linear-gradient(135deg, #42a5f5, #478ed1)",
  Meeting: "linear-gradient(135deg, #ff7043, #f4511e)",
  Training: "linear-gradient(135deg, #26c6da, #0097a7)",
  Event: "linear-gradient(135deg, #ec407a, #d81b60)",
  "Leave Request": "linear-gradient(135deg, #ffa726, #fb8c00)",
  "Incident Report": "linear-gradient(135deg, #8d6e63, #6d4c41)",
  "Daily Log": "linear-gradient(135deg, #ab47bc, #8e24aa)",
  "Idea/Suggestion": "linear-gradient(135deg, #7e57c2, #5e35b1)",
};

const categories = Object.keys(bgMap);

const EmployeeDashboard = () => {
  const { user, employee } = useAuth();
  const [entries, setEntries] = useState([]);
  const [apiDate, setApiDate] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTiny = useMediaQuery('(max-width:350px) and (max-height:1000px)');

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/employee-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(data.filter((e) => !e.done));
      } catch (err) {
        console.error("❌ Failed to fetch employee tasks:", err.response?.data || err.message);
        setEntries([]);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await res.json();
        setApiDate(data.datetime);
      } catch (error) {
        console.error("❌ Failed to fetch API Date:", error.message);
      }
    };
    fetchCurrentDate();
  }, []);

  const counts = categories.reduce((acc, cat) => ({
    ...acc,
    [cat]: entries.filter((e) => e.category === cat).length,
  }), {});

  const upcomingEntries = entries.filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = upcomingEntries[0];
  const daysLeft = upcoming ? Math.ceil((new Date(upcoming.date) - new Date()) / 86400000) : null;
  const dueTitles = upcomingEntries.slice(0, 3).map(e => e.title);

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 4, px: isTiny ? 1 : 2, py: isTiny ? 1 : 2 }}>
      <Fade in>
        <Box>
          <Typography
            variant={isTiny ? "h6" : isMobile ? "h5" : "h4"}
            align="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            👋 Welcome Back, {employee?.name || user?.name || "Employee"}
          </Typography>

          {/* Profile Card */}
          <Card sx={{
            mb: 3,
            p: isTiny ? 1 : 2,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Avatar
                  src={employee?.profilePic || ""}
                  sx={{
                    bgcolor: "primary.main",
                    width: isTiny ? 40 : 56,
                    height: isTiny ? 40 : 56,
                    color: "#fff",
                  }}
                >
                  {!employee?.profilePic &&
                    (employee?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase())}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant={isTiny ? "body1" : "h6"}>
                  {employee?.name || user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Task Category Cards */}
          <Grid container spacing={isTiny ? 1 : 2}>
            {categories.map((cat) => (
              <Grid item xs={12} key={cat}>
                <Card
                  sx={{
                    p: isTiny ? 1 : 2,
                    background: bgMap[cat],
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    alignItems: "center",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" }
                  }}
                >
                  {iconMap[cat] || <AssignmentIcon fontSize="large" sx={{ color: "#fff" }} />}
                  <Box ml={isTiny ? 1 : 2}>
                    <Typography fontWeight="bold">{cat}</Typography>
                    <Typography variant={isTiny ? "h6" : "h5"}>{counts[cat] || 0}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}

            {/* ✅ Pending Tasks Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: isTiny ? 1 : 2,
                  background: "linear-gradient(135deg, #ff8a65, #ff7043)",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 3,
                  display: "flex",
                  alignItems: "center",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <ListAltIcon fontSize="large" sx={{ color: "#fff" }} />
                <Box ml={isTiny ? 1 : 2}>
                  <Typography fontWeight="bold">Pending Tasks</Typography>
                  <Typography variant={isTiny ? "h6" : "h5"}>
                    {entries.filter((e) => e.status === "Pending").length}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Upcoming Due Card */}
            <Grid item xs={12}>
              <Card sx={{
                p: isTiny ? 1 : 2,
                borderRadius: 2,
                boxShadow: 3,
                background: "linear-gradient(135deg,#4fc3f7,#0288d1)",
                color: "#fff"
              }}>
                <Typography fontWeight="bold" gutterBottom>📅 Total Upcoming Due ({upcomingEntries.length})</Typography>
                {dueTitles.length > 0 ? dueTitles.map((title, idx) => (
                  <Typography key={idx} variant="body2">• {title}</Typography>
                )) : (
                  <Typography variant="body2">No upcoming tasks</Typography>
                )}
              </Card>
            </Grid>

            {/* Next Due Card */}
            <Grid item xs={12}>
              <Card sx={{
                p: isTiny ? 1 : 2,
                borderRadius: 2,
                boxShadow: 3,
                background: "linear-gradient(135deg,#ffd54f,#ffca28)"
              }}>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize={isTiny ? "medium" : "large"} />
                  <Box ml={isTiny ? 1 : 2}>
                    <Typography fontWeight="bold">Next Due</Typography>
                    {upcoming ? (
                      <>
                        <Typography variant="body2">{upcoming.title}</Typography>
                        <Typography variant="body2">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</Typography>
                      </>
                    ) : (
                      <Typography variant="body2">No upcoming</Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Manage Tasks Button */}
          <Box textAlign="center" mt={isTiny ? 2 : 4}>
            <Button
              component={RouterLink}
              to="/employee-tasks"
              variant="contained"
              size={isTiny ? "medium" : "large"}
              sx={{
                px: isTiny ? 3 : 5,
                py: isTiny ? 1 : 1.5,
                borderRadius: 4,
                fontWeight: "bold",
              }}
            >
              ➕ Manage Tasks
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default EmployeeDashboard;
