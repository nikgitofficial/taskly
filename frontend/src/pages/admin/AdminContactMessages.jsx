import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Box, Typography, Paper, CircularProgress, Stack,
  Avatar, useTheme, Divider, Chip, Fade, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

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

  const openDeleteDialog = (id) => {
    setSelectedMessageId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessageId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMessageId) return;
    setDeleting(true);
    try {
      await axios.delete(`/contact/delete/${selectedMessageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessageId));
      setSnackbarOpen(true);
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
    } finally {
      setDeleting(false);
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} bgcolor={theme.palette.background.default} minHeight="100vh">
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin-home")}>
          Back to Admin Home
        </Button>
      </Stack>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
        color="primary.main"
        textAlign={{ xs: "center", md: "left" }}
      >
        📩 Contact Messages
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        mb={3}
        textAlign={{ xs: "center", md: "left" }}
      >
        Total Messages: {messages.length}
      </Typography>

      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, maxWidth: 1000, mx: "auto" }}>
        {messages.length === 0 ? (
          <Typography variant="body1" color="text.secondary">No messages received yet.</Typography>
        ) : (
          <Stack spacing={3}>
            {messages.map((msg) => (
              <Fade in key={msg._id}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f5f7fa",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.01)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" flexWrap="wrap">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <MailIcon />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight={600}>{msg.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">{msg.email}</Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={new Date(msg.createdAt).toLocaleString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                      size="small"
                      color="secondary"
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                    <MessageIcon color="primary" />
                    <Typography variant="body2" color="text.primary">{msg.message}</Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => openDeleteDialog(msg._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Fade>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          Message deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminContactMessages;
