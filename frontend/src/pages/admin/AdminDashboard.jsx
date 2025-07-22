// AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Avatar,
  useTheme,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ totalUsers: 0, totalFiles: 0, totalEntries: 0 });
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/admin/dashboard-summary");
        setSummary(res.data?.users || []);
        setTotals({
          totalUsers: res.data?.totalUsers || 0,
          totalFiles: res.data?.totalFiles || 0,
          totalEntries: res.data?.totalEntries || 0,
        });
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} minHeight="100vh" bgcolor={theme.palette.background.default}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        color="primary.main"
        textAlign={{ xs: "center", md: "left" }}
      >
        📊 Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={5}>
        {[
          { icon: <PeopleAltIcon sx={{ fontSize: 50 }} />, label: "Total Users", value: totals.totalUsers, gradient: "linear-gradient(to right, #00c6ff, #0072ff)" },
          { icon: <FolderIcon sx={{ fontSize: 50 }} />, label: "Total Files", value: totals.totalFiles, gradient: "linear-gradient(to right, #f7971e, #ffd200)" },
          { icon: <DescriptionIcon sx={{ fontSize: 50 }} />, label: "Total Entries", value: totals.totalEntries, gradient: "linear-gradient(to right, #f953c6, #b91d73)" },
        ].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: "center",
                  color: "white",
                  background: item.gradient,
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  transition: "0.3s",
                }}
              >
                {item.icon}
                <Typography variant="h6" fontWeight={700} mt={2}>{item.label}</Typography>
                <Typography variant="h3" fontWeight={900}>{item.value}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* User List */}
      <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          User Overview
        </Typography>

        {summary.length === 0 ? (
          <Typography color="text.secondary">No user data found.</Typography>
        ) : (
          <Stack spacing={3}>
            {summary.map((user) => (
              <motion.div key={user.userId} whileHover={{ scale: 1.02 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f9f9f9",
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: "linear-gradient(to right, #2196f3, #21cbf3)",
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/admin/user/${user.userId}`)}
                  >
                    View
                  </Button>
                </Box>
              </motion.div>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
