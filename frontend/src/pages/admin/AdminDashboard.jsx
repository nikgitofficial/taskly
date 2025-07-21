// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Box, Typography, Paper, CircularProgress, Grid } from "@mui/material";

const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/admin/dashboard-summary");
        setSummary(res.data);
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
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {summary.map(user => (
          <Grid item xs={12} md={6} lg={4} key={user.userId}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="subtitle1">Files Uploaded: {user.fileCount}</Typography>
              <Typography variant="subtitle1">Entries Created: {user.entryCount}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
