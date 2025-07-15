// src/components/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
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
  const isEmployee = user?.role === "employee";
  const isMobile = useMediaQuery("(max-width:768px)");

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    setLogoutLoading(true);
    setTimeout(() => {
      logout();
      setLogoutLoading(false);
      setSnackbarOpen(true);
      navigate("/login");
    }, 1000);
  };

  const navItems = [
   
    ...(isStudent
      ? [
          { to: "/student-home", label: "Home" },
          { to: "/student-entry", label: "Create Entry" },
          { to: "/student-profile", label: "Profile" },
          { to: "/student-dashboard", label: "Dashboard" },
          { to: "/student-files", label: "Files" }, 
        ] 
          : isEmployee
    ? [
        { to: "/employee-home", label: "Dashboard" },
        { to: "/employee-profile", label: "Profile" },
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
      <AppBar position="fixed" sx={{ backgroundColor: "#1e1e1e", px: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
            <>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    minWidth: 180,
                  },
                }}
              >
                {user ? (
                  <>
                    {navItems.map((item) => (
                      <MenuItem
                        key={item.to}
                        component={NavLink}
                        to={item.to}
                        onClick={handleMenuClose}
                        sx={{
                          "&:hover": { backgroundColor: "#333", color: "#fff" },
                          "&.active": { backgroundColor: "#444" },
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ "&:hover": { backgroundColor: "#333", color: "#fff" } }}
                    >
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      component={NavLink}
                      to="/login"
                      onClick={handleMenuClose}
                      sx={{
                        "&:hover": { backgroundColor: "#333", color: "#fff" },
                        "&.active": { backgroundColor: "#444" },
                      }}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/register"
                      onClick={handleMenuClose}
                      sx={{
                        "&:hover": { backgroundColor: "#333", color: "#fff" },
                        "&.active": { backgroundColor: "#444" },
                      }}
                    >
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

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

// Desktop Nav Button
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
