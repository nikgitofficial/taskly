import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
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
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={3}
          color="primary"
        >
          👥 Manage Users
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={5}
        >
          View and manage student and employee profiles.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
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
              <PersonIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Students
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage student profiles and records.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/student-users")}
              >
                View Student Users
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
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
              <WorkIcon sx={{ fontSize: 50, color: "#43a047" }} />
              <Typography variant="h5" fontWeight={600} mt={2} mb={1}>
                Employees
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage employee profiles and tasks.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/employee-users")}
              >
                View Employee Users
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManageUsers;
