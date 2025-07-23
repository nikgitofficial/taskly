import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  Button,
  Fade,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: AccountCircleIcon,
    title: "Secure Login System",
    description:
      "Students and employees can log in securely with role-based access to their dashboards and activities.",
    gradient: "linear-gradient(135deg, #4A90E2, #007AFF)",
  },
  {
    icon: UploadFileIcon,
    title: "File Upload & Storage",
    description:
      "Easily upload and manage files related to coursework, documents, or work assignments.",
    gradient: "linear-gradient(135deg, #FF6B6B, #FF9472)",
  },
  {
    icon: AssignmentTurnedInIcon,
    title: "Entry Tracking",
    description:
      "Track and monitor entries such as submissions, tasks, and projects in a streamlined dashboard.",
    gradient: "linear-gradient(135deg, #42E695, #3BB2B8)",
  },
  {
    icon: PeopleIcon,
    title: "Role-Based Dashboard",
    description:
      "Separate views and features tailored for students, employees, and administrators to enhance usability.",
    gradient: "linear-gradient(135deg, #B06AB3, #4568DC)",
  },
];

const About = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 4, md: 8 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box textAlign="center">
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={3}
              color="primary.main"
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              About Taskly
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              mb={6}
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Taskly is a modern platform built to help students and employees
              manage their tasks efficiently with secure login, file uploads,
              and activity tracking.
            </Typography>
          </Box>
        </Fade>

        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Fade in timeout={800 + idx * 300}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      background: feature.gradient,
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 4,
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 70,
                          mb: 2,
                          transition: "transform 0.4s",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={1}
                        sx={{ fontSize: { xs: "1.2rem", md: "1.4rem" } }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        <Fade in timeout={1500}>
          <Box mt={8} textAlign="center">
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary.main"
              mb={2}
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Ready to get started?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={4}
              sx={{ fontSize: { xs: "1rem", md: "1.15rem" } }}
            >
              Sign up today and simplify how you manage files and track your
              tasks.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                color: "#fff",
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                "&:hover": {
                  background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                },
              }}
              onClick={handleClick}
            >
              Get Started
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default About;
