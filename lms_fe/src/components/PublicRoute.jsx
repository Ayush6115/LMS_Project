import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { userRole } = useContext(AuthContext);

  // redirect logged-in users to their dashboards
  if (userRole === "Student") return <Navigate to="/student/dashboard" replace />;
  if (userRole === "Teacher") return <Navigate to="/teacher/dashboard" replace />;
  if (userRole === "Admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}

export default PublicRoute;
