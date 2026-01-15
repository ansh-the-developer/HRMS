import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import HomePage from "../features/home/HomePage";
import EmployeeListPage from "@/features/employee/pages/EmployeeListPage";
import EmployeeDepartmentsPage from "@/features/employee/pages/EmployeeDepartmentsPage";
import EmployeeBranchesPage from "@/features/employee/pages/EmployeeBranchesPage";
import EmployeeDesignationsPage from "@/features/employee/pages/EmployeeDesignationsPage";
import EmployeeStatusesPage from "@/features/employee/pages/EmployeeStatusesPage";
import EmployeeTypesPage from "@/features/employee/pages/EmployeeTypesPage";
import EmployeeExportPage from "@/features/employee/pages/EmployeeExportPage";

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

    <Route
      path="/employees/branches"
      element={
        <ProtectedRoute>
          <EmployeeBranchesPage />
        </ProtectedRoute>
      }
    />

    {/* Job Titles / Positions */}
    <Route
      path="/employees/designations"
      element={
        <ProtectedRoute>
          <EmployeeDesignationsPage />
        </ProtectedRoute>
      }
    />

    {/* Employment Statuses */}
    <Route
      path="/employees/statuses"
      element={
        <ProtectedRoute>
          <EmployeeStatusesPage />
        </ProtectedRoute>
      }
    />

    {/* Employee Types */}
    <Route
      path="/employees/types"
      element={
        <ProtectedRoute>
          <EmployeeTypesPage />
        </ProtectedRoute>
      }
    />

    {/* Export */}
    <Route
      path="/employees/export"
      element={
        <ProtectedRoute>
          <EmployeeExportPage />
        </ProtectedRoute>
      }
    />
  </>
);

export default HomeRoutes;
