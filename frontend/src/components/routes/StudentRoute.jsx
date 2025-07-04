// src/components/routes/StudentRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "student") return <Navigate to="/" />;

  return children;
};

export default StudentRoute;
