import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
// import HomePage from "../features/home/HomePage";
import HomePage from "@/features/home/homePage";  // ← FIXED
import EmployeeListPage from "@/features/employee/pages/EmployeeListPage";
import EmployeeDepartmentsPage from "@/features/employee/pages/EmployeeDepartmentsPage";
import EmployeeBranchesPage from "@/features/employee/pages/EmployeeBranchesPage";
import EmployeeDesignationsPage from "@/features/employee/pages/EmployeeDesignationsPage";
import EmployeeStatusesPage from "@/features/employee/pages/EmployeeStatusesPage";
import EmployeeTypesPage from "@/features/employee/pages/EmployeeTypesPage";
import EmployeeExportPage from "@/features/employee/pages/EmployeeExportPage";

import AttendanceDashboardPage from "@/features/attendance/pages/AttendanceDashboardPage";
import WorkingDaysPage from "@/features/attendance/pages/WorkingDaysPage";
import WorkingHoursPage from "@/features/attendance/pages/WorkingHoursPage";
import WorkingRulesPage from "@/features/attendance/pages/WorkingRulesPage";
import EditWorkingRulePage from "@/features/attendance/pages/EditWorkingRulePage";
import EditAttendancePage from "@/features/attendance/pages/EditAttendancePage";
import AttendanceExportPage from "@/features/attendance/pages/AttendanceExportPage";
import EditWorkingDaysPage from "@/features/attendance/pages/EditWorkingDaysPage";

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
    {/* ================= Attendance ================= */}

    <Route
      path="/attendance"
      element={
        <ProtectedRoute>
          <AttendanceDashboardPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/working-days"
      element={
        <ProtectedRoute>
          <WorkingDaysPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/working-days/edit"
      element={
        <ProtectedRoute>
          <EditWorkingDaysPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/working-hours"
      element={
        <ProtectedRoute>
          <WorkingHoursPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/working-rules"
      element={
        <ProtectedRoute>
          <WorkingRulesPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/working-rules/edit"
      element={
        <ProtectedRoute>
          <EditWorkingRulePage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/edit"
      element={
        <ProtectedRoute>
          <EditAttendancePage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance/export"
      element={
        <ProtectedRoute>
          <AttendanceExportPage />
        </ProtectedRoute>
      }
    />
  </>
);

export default HomeRoutes;
