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
      <CircularProgress />
    </Box>
  );

  if (!user) return <Typography>User not found.</Typography>;

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 3, maxWidth: 600, width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={user.profilePic || ""}
            sx={{ width: 100, height: 100, mb: 2, bgcolor: "primary.main" }}
          >
            {!user.profilePic && (user.name?.charAt(0).toUpperCase() || "U")}
          </Avatar>

          <Typography variant="h5" fontWeight="bold">{user.name || "Unnamed User"}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          <Typography variant="caption" color="text.secondary">{user.role?.toUpperCase()}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          {user.role === "student" && (
            <>
              <Typography>🎓 Course: {user.course || "N/A"}</Typography>
              <Typography>📚 Year Level: {user.yearLevel || "N/A"}</Typography>
            </>
          )}
          {user.role === "employee" && (
            <>
              <Typography>🏢 Department: {user.department || "N/A"}</Typography>
              <Typography>💼 Position: {user.position || "N/A"}</Typography>
            </>
          )}
          {user.role === "admin" && (
            <Typography>👑 Admin account - no additional profile details.</Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserDetails;
