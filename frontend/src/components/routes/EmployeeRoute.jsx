// src/components/routes/EmployeeRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EmployeeRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "employee") return <Navigate to="/not-authorized" />;

  return children;
};

export default EmployeeRoute;
