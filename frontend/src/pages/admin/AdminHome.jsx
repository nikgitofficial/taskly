import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import MailIcon from "@mui/icons-material/Mail";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          mb={2}
          color="text.primary"
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mb={5}
        >
          Manage your system effectively with quick access panels.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                },
              }}
            >
              <DashboardIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Overview Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                View statistics and overall summaries.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/admin-dashboard")}
              >
                View Dashboard
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                },
              }}
            >
              <GroupsIcon sx={{ fontSize: 50, color: "#43a047" }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Manage Users
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Access student and employee profiles.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/dashboard")}
              >
                Go to Users
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                },
              }}
            >
              <MailIcon sx={{ fontSize: 50, color: "#fb8c00" }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Contact Messages
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                View user inquiries and feedback.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin-contact-messages")}
              >
                View Messages
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                },
              }}
            >
              <AssignmentIcon sx={{ fontSize: 50, color: "#f50057" }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Manage Entries
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Approve and review user submissions.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/dashboard")}
              >
                Review Entries
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminHome;
