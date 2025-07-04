import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotAuthorized from "./pages/NotAuthorized";

import PrivateRoute from "./components/PrivateRoute";
import StudentRoute from "./components/routes/StudentRoute";

import StudentHome from "./pages/StudentHome";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";

const App = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100vw"
      overflow="hidden"
    >
      <Navbar />

      <Box
        component="main"
        flexGrow={1}
        mt="64px" // Adjust for Navbar
        mb="60px" // Adjust for Footer
        px={2}
      >
        <Routes>
          {/* ✅ Admin-only homepage */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* ✅ Student routes */}
          <Route
            path="/student-home"
            element={
              <StudentRoute>
                <StudentHome />
              </StudentRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/student-profile"
            element={
              <StudentRoute>
                <StudentProfile />
              </StudentRoute>
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback for blocked roles */}
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Box>

            <Footer />
    </Box>
  );
};

export default App;
