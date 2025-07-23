import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminRoute from "./components/routes/AdminRoute";

import StudentEntry from "./pages/students/StudentEntry";
import StudentDashboard from "./pages/students/StudentDashboard";
import StudentProfile from "./pages/students/StudentProfile";
import StudentFiles from "./pages/students/StudentFiles";
import StudentHome from "./pages/students/StudentHome";

import EmployeeHome from "./pages/employee/EmployeeHome";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeCreateEntry from "./pages/employee/EmployeeCreateEntry";
import EmployeeFile from "./pages/employee/EmployeeFile"
import EmployeeDashboard from "./pages/employee/EmployeeDashboard"

import AdminHome from "./pages/admin/AdminHome";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDetails from "./pages/admin/UserDetails";

import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import ManageUsers from "./pages/admin/ManageUsers";
import StudentUsers from "./pages/admin/StudentUsers";
import EmployeeUsers from "./pages/admin/EmployeeUsers";
import AdminProfile from "./pages/admin/AdminProfile";

import ForgotPassword from "./pages/ForgotPassword";



const App = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" width="100%" overflow="hidden">
      <Navbar />
      <Box component="main" flexGrow={1} mt="64px" mb="60px" px={2}>
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          {/* ✅ Private Home Route */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

            {/* ✅ public Route */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         
          

          {/* ✅ Student Routes */}
          <Route path="/student-home" element={<StudentRoute><StudentHome /></StudentRoute>} />
          <Route path="/student-entry" element={<StudentRoute><StudentEntry /></StudentRoute>} />
          <Route path="/student-dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/student-profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
          <Route path="/student-files" element={<StudentRoute><StudentFiles /></StudentRoute>} />

          {/* ✅ Employee Routes */}
          <Route path="/employee-home" element={<EmployeeRoute><EmployeeHome /></EmployeeRoute>} />
          <Route path="/employee-profile" element={<EmployeeRoute><EmployeeProfile /></EmployeeRoute>} />
          <Route path="/employee-create-entry" element={<EmployeeRoute><EmployeeCreateEntry /></EmployeeRoute>} />
          <Route path="/employee-file" element={<EmployeeRoute><EmployeeFile /></EmployeeRoute>} />
          <Route path="/employee-dashboard" element={<EmployeeRoute><EmployeeDashboard /></EmployeeRoute>} />

            
          {/* ✅ Admin Routes */}
          <Route path="/admin-home" element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/user/:id" element={<AdminRoute><UserDetails /></AdminRoute>} />
          <Route path="/admin-contact-messages" element={<AdminRoute><AdminContactMessages /></AdminRoute>} />
          <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/student-users" element={<AdminRoute><StudentUsers /></AdminRoute>} />
          <Route path="/employee-users" element={<AdminRoute><EmployeeUsers /></AdminRoute>} />
          <Route path="/admin-profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />


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
