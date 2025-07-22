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
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
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
    <Box p={{ xs: 2, md: 4 }} bgcolor={theme.palette.background.default} minHeight="100vh">
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        color={theme.palette.primary.main}
        textAlign={{ xs: "center", md: "left" }}
      >
        📊 Admin Dashboard
      </Typography>

      {/* ✅ Summary Counts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "#f9f9f9",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 5px 10px rgba(0,0,0,0.15)", transform: "scale(1.02)", transition: "0.3s" },
            }}
          >
            <PeopleAltIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Total Users</Typography>
            <Typography variant="h4" fontWeight={900}>{totals.totalUsers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "#f9f9f9",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 5px 10px rgba(0,0,0,0.15)", transform: "scale(1.02)", transition: "0.3s" },
            }}
          >
            <FolderIcon sx={{ fontSize: 50, color: "#2e7d32" }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Total Files</Typography>
            <Typography variant="h4" fontWeight={900}>{totals.totalFiles}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "#f9f9f9",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 5px 10px rgba(0,0,0,0.15)", transform: "scale(1.02)", transition: "0.3s" },
            }}
          >
            <DescriptionIcon sx={{ fontSize: 50, color: "#d32f2f" }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Total Entries</Typography>
            <Typography variant="h4" fontWeight={900}>{totals.totalEntries}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ User Overview Section */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          maxWidth: 1000,
          mx: "auto",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
          User Overview
        </Typography>

        {summary.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No user data found.</Typography>
        ) : (
          <Box sx={{ maxHeight: "1000px", overflowY: "auto", pr: 1 }}>
            <Stack spacing={3}>
              {summary.map((user) => (
                <Box
                  key={user.userId}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        background: "linear-gradient(135deg, #2196f3, #21cbf3)",
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight={600}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email || "No email available"}</Typography>
                    </Box>
                    <Button variant="contained" size="small" onClick={() => navigate(`/admin/user/${user.userId}`)}>View Details</Button>
                  </Stack>

                  <Box mt={2}>
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                      <StatBox icon={<FolderIcon color="success" />} label="Files" value={user.fileCount} />
                      <StatBox icon={<DescriptionIcon color="primary" />} label="Entries" value={user.entryCount} />
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

// ✅ StatBox Component
const StatBox = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon}
    <Typography variant="body2" fontWeight="medium" color="text.secondary">
      {label}:{" "}
      <Typography component="span" fontWeight={700} color="text.primary" sx={{ ml: 0.5 }}>
        {value}
      </Typography>
    </Typography>
  </Stack>
);

export default AdminDashboard;
