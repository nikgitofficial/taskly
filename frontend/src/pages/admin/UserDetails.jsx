import { useParams, useNavigate } from "react-router-dom";
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
  Chip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          bgcolor: "background.paper",
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={user.profilePic || ""}
            sx={{
              width: 130,
              height: 130,
              fontSize: 48,
              mb: 2,
              boxShadow: 4,
              background: user.profilePic
                ? "transparent"
                : "linear-gradient(135deg, #2196f3, #21cbf3)",
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

          <Chip
            label={user.role?.toUpperCase() || "ROLE"}
            color="primary"
            variant="outlined"
            sx={{
              mt: 1.5,
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: 12,
            }}
          />
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
