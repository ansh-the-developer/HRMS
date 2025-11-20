import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "../features/home/homePage";

const HomeRoutes = () => (
  <>
    <Route 
      path="/home" 
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } 
    />
  </>
);

export default HomeRoutes;
