import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
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
  Assignment: <AssignmentIcon fontSize="large" sx={{ color: "#fff" }} />,
  Task: <TaskIcon fontSize="large" sx={{ color: "#fff" }} />,
  Event: <EventIcon fontSize="large" sx={{ color: "#fff" }} />,
  Todo: <ListAltIcon fontSize="large" sx={{ color: "#fff" }} />,
};

const bgMap = {
  Assignment: "linear-gradient(135deg, #42a5f5, #478ed1)",
  Task: "linear-gradient(135deg, #66bb6a, #43a047)",
  Event: "linear-gradient(135deg, #ff7043, #f4511e)",
  Todo: "linear-gradient(135deg, #ab47bc, #8e24aa)",
};

const StudentDashboard = () => {
  const { student, user } = useAuth();
  const [entries, setEntries] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/student-entries", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((entry) => !entry.done);
        setEntries(filtered);

        const now = new Date();
        const vibrated = JSON.parse(localStorage.getItem("vibrated") || "[]");

        filtered.forEach((entry) => {
          const due = new Date(entry.date);
          const diffH = (due - now) / (1000 * 60 * 60);
          if (diffH > 0 && diffH <= 12 && !vibrated.includes(entry._id)) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            if (Notification.permission === "granted") {
              new Notification("🕑 Due Soon", {
                body: `${entry.title} is due in ${Math.round(diffH)}h`,
                tag: entry._id,
              });
            }
            vibrated.push(entry._id);
          }
        });

        localStorage.setItem("vibrated", JSON.stringify(vibrated));
      } catch (err) {
        console.error("Failed to fetch entries:", err);
      }
    };

    fetchEntries();
  }, []);

  const categories = ["Assignment", "Task", "Event", "Todo"];
  const counts = categories.reduce(
    (acc, cat) => ({
      ...acc,
      [cat]: entries.filter((e) => e.category === cat).length,
    }),
    {}
  );

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Fade in>
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            🎓 Welcome Back, {student?.name || "Student"}
          </Typography>

          {/* Profile Card */}
          <Card
            sx={{
              mb: 4,
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              boxShadow: 6,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  src={student?.profilePic || ""}
                  alt={student?.name}
                  sx={{
                    bgcolor: "primary.main",
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    fontSize: { xs: 22, sm: 26 },
                    color: "#fff",
                  }}
                >
                  {!student?.profilePic &&
                    (student?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase())}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{student?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2">
                  {student?.course} • Year {student?.yearLevel}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Overview Cards */}
          <Grid container spacing={3}>
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={3} key={cat}>
                <Card
                  sx={{
                    p: 2,
                    height: "100%",
                    background: bgMap[cat],
                    color: "#fff",
                    borderRadius: 3,
                    boxShadow: 6,
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {iconMap[cat]}
                    <Box ml={2}>
                      <Typography fontWeight="bold">{cat}</Typography>
                      <Typography variant="h5">{counts[cat]}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}

            {/* Total Due Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  background: "linear-gradient(135deg,#4fc3f7,#0288d1)",
                  borderRadius: 3,
                  boxShadow: 6,
                  color: "#fff",
                }}
              >
                <Box display="flex" flexDirection="column">
                  <Typography fontWeight="bold" gutterBottom>
                    📅 Total Upcoming Due
                  </Typography>
                  <Typography variant="h4">{dueCount}</Typography>
                  {dueTitles.length > 0 ? (
                    <Box mt={1}>
                      {dueTitles.map((title, idx) => (
                        <Typography key={idx} variant="body2">
                          • {title}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2">No upcoming tasks</Typography>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Next Due Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  background: "linear-gradient(135deg,#ffd54f,#ffca28)",
                  borderRadius: 3,
                  boxShadow: 6,
                }}
              >
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize="large" />
                  <Box ml={2}>
                    <Typography fontWeight="bold">Next Due</Typography>
                    {upcoming ? (
                      <>
                        <Typography>{upcoming.title}</Typography>
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

          {/* Manage Entries CTA */}
          <Box textAlign="center" mt={5}>
            <Button
              component={RouterLink}
              to="/student-home"
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 6,
                fontWeight: "bold",
                boxShadow: 4,
              }}
            >
              ➕ Manage Entries
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default StudentDashboard;
