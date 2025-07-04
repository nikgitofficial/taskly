import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";  // ← use NavLink
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === "student";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1e1e1e",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        px: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={NavLink}
          to="/"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
        >
          <img src={logo} alt="Logo" style={{ height: 40, borderRadius: 8, marginRight: 10 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Taskly
          </Typography>
        </Box>

        {/* Links */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {user ? (
            <>
              <NavButton to="/" label="Home" />
              {isStudent && (
                <>
                  <NavButton to="/student-home" label="Student Home" />
                  <NavButton to="/student-profile" label="Profile" />
                  <NavButton to="/student-dashboard" label="Dashboard" />
                </>
              )}
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
      </Toolbar>
    </AppBar>
  );
};

// Reusable NavLink button with active styling
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
