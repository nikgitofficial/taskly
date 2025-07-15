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
import EmployeeRoute from "./components/routes/EmployeeRoute";

import StudentEntry from "./pages/students/StudentEntry";
import StudentDashboard from "./pages/students/StudentDashboard";
import StudentProfile from "./pages/students/StudentProfile";
import StudentFiles from "./pages/students/StudentFiles";
import StudentHome from "./pages/students/StudentHome";

import EmployeeHome from "./pages/employee/EmployeeHome";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

const App = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" width="100vw" overflow="hidden">
      <Navbar />
      <Box component="main" flexGrow={1} mt="64px" mb="60px" px={2}>
        <Routes>

          {/* ✅ Private Home Route */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

          {/* ✅ Student Routes */}
          <Route path="/student-home" element={<StudentRoute><StudentHome /></StudentRoute>} />
          <Route path="/student-entry" element={<StudentRoute><StudentEntry /></StudentRoute>} />
          <Route path="/student-dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/student-profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
          <Route path="/student-files" element={<StudentRoute><StudentFiles /></StudentRoute>} />

          {/* ✅ Employee Routes */}
          <Route path="/employee-home" element={<EmployeeRoute><EmployeeHome /></EmployeeRoute>} />
          <Route path="/employee-profile" element={<EmployeeRoute><EmployeeProfile /></EmployeeRoute>} />

          {/* ✅ Public Routes */}
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
