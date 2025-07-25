import {
  AppBar, Toolbar, Typography, Button, Box, Stack, IconButton,
  Menu, MenuItem, useMediaQuery, Avatar, CircularProgress, Snackbar,
  Fade, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const { user, student, employee, admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudent = user?.role === "student";
  const isEmployee = user?.role === "employee";
  const isAdmin = user?.role === "admin";
  const isMobile = useMediaQuery("(max-width:768px)");

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const fetchCount = async () => {
    try {
      const { data } = await axios.get("/contact/message-count");
      setMessageCount(data.count);
    } catch (err) {
      console.error("❌ Failed to fetch message count:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCount();
    }
  }, [location.pathname, isAdmin]); // ✅ refetch when route changes

  useEffect(() => {
    if (isAdmin) {
      fetchCount();
      const interval = setInterval(fetchCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

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
          { to: "/employee-home", label: "Home" },
          { to: "/employee-profile", label: "Profile" },
          { to: "/employee-create-entry", label: "Create Entry" },
          { to: "/employee-file", label: "Files" },
          { to: "/employee-dashboard", label: "Dashboard" },
        ]
      : isAdmin
      ? [
          { to: "/admin-home", label: "Admin Home" },
          { to: "/admin-dashboard", label: "Admin Dashboard" },
          {
            to: "/admin-contact-messages",
            label: `Messages (${messageCount})`,
            icon: (
              <Badge badgeContent={messageCount} color="error" sx={{ mr: 1 }}>
                <MarkunreadIcon />
              </Badge>
            ),
          },
          { to: "/admin-profile", label: "Admin Profile" },
        ]
      : []),
  ];

  // Determine which profile pic to show
  const profilePic =
    user?.role === "student" ? student?.profilePic :
    user?.role === "employee" ? employee?.profilePic :
    user?.role === "admin" ? admin?.profilePic :
    null;

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
            <img src={logo} alt="Logo" style={{ height: 40, borderRadius: 8, marginRight: 10 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Taskly
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {user ? (
                <>
                  {/* Profile pic avatar */}
                  {profilePic && (
                    <Avatar
                      src={profilePic}
                      alt="Profile Pic"
                      sx={{ width: 36, height: 36, mr: 1 }}
                    >
                      {!profilePic && user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                  )}

                  {navItems.map((item) => (
                    <NavButton key={item.to} to={item.to} label={item.label} icon={item.icon} />
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
                    {/* Show avatar at top of mobile menu */}
                    {profilePic && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Avatar
                          src={profilePic}
                          alt="Profile Pic"
                          sx={{ width: 60, height: 60 }}
                        >
                          {!profilePic && user?.name?.[0]?.toUpperCase()}
                        </Avatar>
                      </Box>
                    )}

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
                        {item.icon && <Box component="span" sx={{ mr: 1 }}>{item.icon}</Box>}
                        {item.label}
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        "&:hover": { backgroundColor: "#333", color: "#fff" },
                      }}
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

const NavButton = ({ to, label, icon }) => (
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
    {icon && <Box component="span" sx={{ mr: 1 }}>{icon}</Box>}
    {label}
  </Button>
);

export default Navbar;
