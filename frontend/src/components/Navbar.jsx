import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Avatar,
  CircularProgress,
  Snackbar,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === "student";
  const isMobile = useMediaQuery("(max-width:768px)");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      logout(); // clear token & user
      setLogoutLoading(false);
      setSnackbarOpen(true); // ✅ Show snackbar after logout
      navigate("/login");
    }, 1000);
  };

  const navItems = [
    { to: "/", label: "Home" },
    ...(isStudent
      ? [
          { to: "/student-home", label: "Create Entry" },
          { to: "/student-profile", label: "Profile" },
          { to: "/student-dashboard", label: "Dashboard" },
        ]
      : []),
  ];

  if (logoutLoading) {
    return (
      <Fade in={logoutLoading}>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "relative", width: 80, height: 80, mb: 2 }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{ color: "#1976d2", position: "absolute", top: 0, left: 0 }}
            />
            <Avatar
              src={logo}
              alt="logo"
              sx={{
                width: 40,
                height: 40,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
              }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Logging out...
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#1e1e1e",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          px: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, borderRadius: 8, marginRight: 10 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Taskly
            </Typography>
          </Box>

          {/* Navigation */}
          {!isMobile ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <NavButton key={item.to} to={item.to} label={item.label} />
                  ))}
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 3, textTransform: "none" }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavButton to="/login" label="Login" />
                  <Button
                    component={NavLink}
                    to="/register"
                    variant="contained"
                    sx={{ borderRadius: 3, textTransform: "none" }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
          ) : (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 220 }}>
          {user ? (
            <>
              {navItems.map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/login">
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/register">
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Snackbar for logout */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Logout successful"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

// NavButton component
const NavButton = ({ to, label }) => (
  <Button
    component={NavLink}
    to={to}
    end
    sx={({ isActive }) => ({
      color: "white",
      textTransform: "none",
      borderRadius: 3,
      px: 2,
      py: 0.8,
      backgroundColor: isActive ? "#444" : "transparent",
      "&:hover": {
        backgroundColor: isActive ? "#444" : "#333",
      },
    })}
  >
    {label}
  </Button>
);

export default Navbar;
