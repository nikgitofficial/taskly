// StudentDashboard.jsx
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
  useMediaQuery,
  Fade
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import EventIcon from "@mui/icons-material/Event";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const iconMap = {
  Assignment: <AssignmentIcon sx={{ color: "#fff", fontSize: 36 }} />,
  Task: <TaskIcon sx={{ color: "#fff", fontSize: 36 }} />,
  Event: <EventIcon sx={{ color: "#fff", fontSize: 36 }} />,
  Todo: <ListAltIcon sx={{ color: "#fff", fontSize: 36 }} />,
};

const bgMap = {
  Assignment: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  Task: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  Event: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  Todo: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const StudentDashboard = () => {
  const { student, user } = useAuth();
  const [entries, setEntries] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("/student-entries");
        setEntries(res.data.filter(e => !e.done));
      } catch (err) {
        console.error("Error fetching entries:", err);
      }
    };
    fetchEntries();
  }, []);

  const categories = ["Assignment", "Task", "Event", "Todo"];
  const counts = categories.reduce((acc, cat) => ({
    ...acc,
    [cat]: entries.filter(e => e.category === cat).length
  }), {});

  const upcomingEntries = entries
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextTask = upcomingEntries[0];
  const daysLeft = nextTask ? Math.ceil((new Date(nextTask.date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: "100vh" }}>
      <Fade in>
        <Box>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
            🎓 Welcome, {student?.name || "Student"}
          </Typography>

          {/* Profile Card */}
          <Card sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            mb: 4,
            bgcolor: "#f5f5f5",
            boxShadow: 3,
            borderRadius: 4
          }}>
            <Avatar
  src={student?.profilePic}
  sx={{ width: 70, height: 70, bgcolor: "primary.main", mr: 3 }}
>
  {!student?.profilePic && (student?.name?.charAt(0).toUpperCase() || "S")}
</Avatar>

            <Box>
              <Typography variant="h6">{student?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Typography variant="body2">{student?.course} • Year {student?.yearLevel}</Typography>
            </Box>
          </Card>

          {/* Category Cards */}
          <Grid container spacing={3} mb={4}>
            {categories.map(cat => (
              <Grid item xs={12} sm={6} key={cat}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  background: bgMap[cat],
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: 4,
                  "&:hover": { transform: "scale(1.02)", transition: "0.3s" }
                }}>
                  <Box>{iconMap[cat]}</Box>
                  <Box textAlign="right">
                    <Typography variant="h6" fontWeight="bold">{cat}</Typography>
                    <Typography variant="h4">{counts[cat]}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Upcoming Task */}
          <Card sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
            color: "#fff",
            mb: 4
          }}>
            <Box display="flex" alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography fontWeight="bold">Next Task</Typography>
                {nextTask ? (
                  <>
                    <Typography>{nextTask.title}</Typography>
                    <Typography variant="body2">{daysLeft} day(s) left</Typography>
                  </>
                ) : (
                  <Typography>No upcoming tasks</Typography>
                )}
              </Box>
            </Box>
          </Card>

          {/* CTA Button */}
          <Box textAlign="center">
            <Button
              component={RouterLink}
              to="/student-home"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
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
