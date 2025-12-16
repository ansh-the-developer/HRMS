import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "../features/home/HomePage";
import EmployeeListPage from "@/features/employee/pages/EmployeeListPage";
import EmployeeDepartmentsPage from './../features/employee/EmployeeDepartmentsPage';
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
    <Route
      path="/employees/departments"
      element={
        <ProtectedRoute>
          <EmployeeDepartmentsPage />
        </ProtectedRoute>
      }
    />
  </>
);

export default HomeRoutes;
