import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Root route - redirects based on auth status */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Authentication-login related pages */}
      {AuthRoutes()}
      
      {/* Home-related pages */}
      {HomeRoutes()}
    </Routes>
  );
};

export default AppRoutes;
