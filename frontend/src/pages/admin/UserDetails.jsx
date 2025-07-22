import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/admin/user/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("❌ Failed to fetch user details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} />
    </Box>
  );

  if (!user) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <Typography variant="h6" color="error">User not found.</Typography>
    </Box>
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" p={2}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          bgcolor: "background.paper"
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={user.profilePic || ""}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              fontSize: 40,
              bgcolor: "primary.main",
              boxShadow: 3,
            }}
          >
            {!user.profilePic && (user.name?.charAt(0).toUpperCase() || "U")}
          </Avatar>

          <Typography variant="h4" fontWeight={700}>
            {user.name || "Unnamed User"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
          <Typography
            variant="caption"
            color="primary.main"
            sx={{
              background: "rgba(25, 118, 210, 0.1)",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              mt: 1
            }}
          >
            {user.role?.toUpperCase()}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          {user.role === "student" && (
            <>
              <Typography variant="subtitle1">🎓 <b>Course:</b> {user.course || "N/A"}</Typography>
              <Typography variant="subtitle1">📚 <b>Year Level:</b> {user.yearLevel || "N/A"}</Typography>
            </>
          )}
          {user.role === "employee" && (
            <>
              <Typography variant="subtitle1">🏢 <b>Department:</b> {user.department || "N/A"}</Typography>
              <Typography variant="subtitle1">💼 <b>Position:</b> {user.position || "N/A"}</Typography>
            </>
          )}
          {user.role === "admin" && (
            <Typography variant="subtitle1">👑 <b>Admin account:</b> No additional details.</Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserDetails;
