// src/App.jsx
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
import EmployeeRoute from "./components/routes/EmployeeRoute"; // ✅ added employee route

import StudentHome from "./pages/students/StudentHome";
import StudentDashboard from "./pages/students/StudentDashboard";
import StudentProfile from "./pages/students/StudentProfile";
import StudentFiles from "./pages/students/StudentFiles";

import EmployeeHome from "./pages/employee/EmployeeHome"; // ✅ add employee page

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

      <Box component="main" flexGrow={1} mt="64px" mb="60px" px={2}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* ✅ Student Routes */}
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
          <Route
            path="/student-files"
            element={
              <StudentRoute>
                <StudentFiles />
              </StudentRoute>
            }
          />

          {/* ✅ Employee Routes */}
          <Route
            path="/employee"
            element={
              <EmployeeRoute>
                <EmployeeHome />
              </EmployeeRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
};

export default App;
