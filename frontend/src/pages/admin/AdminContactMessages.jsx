import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box, Typography, Paper, CircularProgress, Stack,
  Avatar, useTheme, Divider, Chip, Tooltip
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/contact/contact-messages");
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
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
        color="primary.main"
        textAlign={{ xs: "center", md: "left" }}
      >
        📩 Contact Messages
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          maxWidth: 1000,
          mx: "auto",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No messages received yet.</Typography>
        ) : (
          <Stack spacing={3}>
            {messages.map((msg) => (
              <Box
                key={msg._id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#f5f7fa",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <MailIcon />
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {msg.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{msg.email}</Typography>
                    </Stack>
                  </Box>
                  <Chip label={new Date(msg.createdAt).toLocaleString()} size="small" />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <MessageIcon color="primary" />
                  <Typography variant="body2" color="text.primary">{msg.message}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default AdminContactMessages;
