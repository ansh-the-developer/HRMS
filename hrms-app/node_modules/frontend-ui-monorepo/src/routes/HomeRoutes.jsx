import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "../features/home/HomePage";
import EmployeeListPage from "@/features/employee/pages/EmployeeListPage";

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
    <Route
      path="/employees"
      element={
        <ProtectedRoute>
          <EmployeeListPage />
        </ProtectedRoute>
      }
    />
  </>
);

export default HomeRoutes;
