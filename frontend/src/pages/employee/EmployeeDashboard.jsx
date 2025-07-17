import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import axios from "../../api/axios";
import {
  Container,
  Typography,
  Card,
  Grid,
  Button,
  Avatar,
  Box,
  Fade,
  useMediaQuery,
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
  "Daily Log": <ListAltIcon fontSize="large" sx={{ color: "#fff" }} />,
  // Add more if needed
};

const bgMap = {
  Task: "linear-gradient(135deg, #66bb6a, #43a047)",
  "Project Update": "linear-gradient(135deg, #42a5f5, #478ed1)",
  Meeting: "linear-gradient(135deg, #ff7043, #f4511e)",
  "Daily Log": "linear-gradient(135deg, #ab47bc, #8e24aa)",
  // Add more if needed
};

const categories = ["Task", "Project Update", "Meeting", "Daily Log"];

const EmployeeDashboard = () => {
  const { user, employee } = useAuth(); // adjust if your context uses 'employee' or 'user'
  const [entries, setEntries] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTiny = useMediaQuery('(max-width:350px) and (max-height:1000px)');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/employee-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to fetch employee tasks:", err);
      }
    };

    fetchEntries();
  }, []);

  // Calculate counts per category
  const counts = categories.reduce(
    (acc, cat) => ({
      ...acc,
      [cat]: entries.filter((e) => e.category === cat).length,
    }),
    {}
  );

  // Upcoming due tasks (future date)
  const upcomingEntries = entries
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = upcomingEntries[0];
  const daysLeft = upcoming
    ? Math.ceil((new Date(upcoming.date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const dueCount = upcomingEntries.length;
  const dueTitles = upcomingEntries.slice(0, 3).map((e) => e.title);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        mb: 4,
        px: isTiny ? 1 : 2,
        py: isTiny ? 1 : 2,
        minHeight: '1000px',
      }}
    >
      <Fade in>
        <Box>
          <Typography
            variant={isTiny ? "h6" : isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
            sx={{ lineHeight: 1.2 }}
          >
            👋 Welcome Back, {employee?.name || user?.name || "Employee"}
          </Typography>

          {/* Profile Card */}
          <Card
            sx={{
              mb: 3,
              p: isTiny ? 1 : { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Avatar
                  src={employee?.profilePic || ""}
                  alt={employee?.name || user?.name}
                  sx={{
                    bgcolor: "primary.main",
                    width: isTiny ? 40 : { xs: 56, sm: 64 },
                    height: isTiny ? 40 : { xs: 56, sm: 64 },
                    fontSize: isTiny ? 16 : { xs: 22, sm: 26 },
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
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                {/* Add other employee info if any */}
              </Grid>
            </Grid>
          </Card>

          {/* Overview Cards */}
          <Grid container spacing={isTiny ? 1 : 2}>
            {categories.map((cat) => (
              <Grid item xs={12} key={cat}>
                <Card
                  sx={{
                    p: isTiny ? 1 : 2,
                    height: "auto",
                    background: bgMap[cat] || "#666",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    alignItems: "center",
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

            {/* Total Upcoming Due Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: isTiny ? 1 : 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  background: "linear-gradient(135deg,#4fc3f7,#0288d1)",
                  color: "#fff",
                }}
              >
                <Typography fontWeight="bold" gutterBottom>
                  📅 Total Upcoming Due ({dueCount})
                </Typography>
                {dueTitles.length > 0 ? (
                  dueTitles.map((title, idx) => (
                    <Typography key={idx} variant="body2">
                      • {title}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No upcoming tasks</Typography>
                )}
              </Card>
            </Grid>

            {/* Next Due Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: isTiny ? 1 : 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  background: "linear-gradient(135deg,#ffd54f,#ffca28)",
                }}
              >
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize={isTiny ? "medium" : "large"} />
                  <Box ml={isTiny ? 1 : 2}>
                    <Typography fontWeight="bold">Next Due</Typography>
                    {upcoming ? (
                      <>
                        <Typography variant="body2">{upcoming.title}</Typography>
                        <Typography variant="body2">
                          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">No upcoming</Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Manage Tasks CTA */}
          <Box textAlign="center" mt={isTiny ? 2 : 4}>
            <Button
              component={RouterLink}
              to="/employee-tasks" // adjust if your route differs
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
