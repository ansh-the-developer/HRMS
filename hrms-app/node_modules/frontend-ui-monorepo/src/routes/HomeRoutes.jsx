import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Home
import HomePage from "@/features/home/homePage";

// Employee
import EmployeeListPage from "@/features/employee/pages/EmployeeListPage";
import EmployeeDepartmentsPage from "@/features/employee/pages/EmployeeDepartmentsPage";
import EmployeeBranchesPage from "@/features/employee/pages/EmployeeBranchesPage";
import EmployeeDesignationsPage from "@/features/employee/pages/EmployeeDesignationsPage";
import EmployeeStatusesPage from "@/features/employee/pages/EmployeeStatusesPage";
import EmployeeTypesPage from "@/features/employee/pages/EmployeeTypesPage";
import EmployeeExportPage from "@/features/employee/pages/EmployeeExportPage";

// Attendance
import AttendanceDashboardPage from "@/features/attendance/pages/AttendanceDashboardPage";
import WorkingDaysPage from "@/features/attendance/pages/WorkingDaysPage";
import WorkingHoursPage from "@/features/attendance/pages/WorkingHoursPage";
import WorkingRulesPage from "@/features/attendance/pages/WorkingRulesPage";
import EditWorkingRulePage from "@/features/attendance/pages/EditWorkingRulePage";
import EditAttendancePage from "@/features/attendance/pages/EditAttendancePage";
import AttendanceExportPage from "@/features/attendance/pages/AttendanceExportPage";
import EditWorkingDaysPage from "@/features/attendance/pages/EditWorkingDaysPage";

// Leaves
import LeavesDashboardPage from "@/features/leaves/pages/LeavesDashboardPage";
import LeaveRequiredFormPage from "@/features/leaves/pages/LeaveRequiredFormPage";
import LeaveRequestUploadPage from "@/features/leaves/pages/LeaveRequestUploadPage";
import LeaveSubmitStatusPage from "@/features/leaves/pages/LeaveSubmitStatusPage";
import LeaveRequestListPage from "@/features/leaves/pages/LeaveRequestListPage";
import LeaveRequestActionPage from "@/features/leaves/pages/LeaveRequestActionPage";
import LeaveRulesPage from "@/features/leaves/pages/LeaveRulesPage";
import LeaveRulesApprovalFlowPage from "@/features/leaves/pages/LeaveRulesApprovalFlowPage";

// Performance
import PerformanceDashboardPage from "@/features/performance/pages/PerformanceDashboardPage";
import PerformanceHistoryPage from "@/features/performance/pages/PerformanceHistoryPage";
import PerformanceReviewDetailPage from "@/features/performance/pages/PerformanceReviewDetailPage";
import PerformanceNewReviewPage from "@/features/performance/pages/PerformanceNewReviewPage";

// Payroll ⭐ NEW MODULE
import PayrollDashboardPage from "@/features/payroll/pages/PayrollDashboardPage";
import ReimbursementStatusPage from "@/features/payroll/pages/ReimbursementStatusPage";
import SalaryStructurePage from "@/features/payroll/pages/SalaryStructurePage";
import PayrollSlipsPage from "@/features/payroll/pages/PayrollSlipsPage";
import RecordPaymentPage from "@/features/payroll/pages/RecordPaymentPage";
import PendingPaymentsPage from "@/features/payroll/pages/PendingPaymentsPage";
import PayrollOverviewPage from "@/features/payroll/pages/PayrollOverviewPage";
// ── Settings ──
import SettingsDashboardPage from "@/features/settings/pages/SettingsDashboardPage";
import UserManagementPage from "@/features/settings/pages/UserManagementPage";
import CompanyDetailsPage from "@/features/settings/pages/CompanyDetailsPage";
import PermissionsManagerPage from "@/features/settings/pages/PermissionsManagerPage";

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

    {/* ================= Employee ================= */}
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

    {/* ================= Leaves ================= */}
    <Route
      path="/leaves"
      element={
        <ProtectedRoute>
          <LeavesDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/required-form"
      element={
        <ProtectedRoute>
          <LeaveRequiredFormPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/request-upload"
      element={
        <ProtectedRoute>
          <LeaveRequestUploadPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/submit-status"
      element={
        <ProtectedRoute>
          <LeaveSubmitStatusPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/requests"
      element={
        <ProtectedRoute>
          <LeaveRequestListPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/requests/:id"
      element={
        <ProtectedRoute>
          <LeaveRequestActionPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/rules"
      element={
        <ProtectedRoute>
          <LeaveRulesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/leaves/rules/approval-flow"
      element={
        <ProtectedRoute>
          <LeaveRulesApprovalFlowPage />
        </ProtectedRoute>
      }
    />

    {/* ================= Performance ================= */}
    <Route
      path="/performance"
      element={
        <ProtectedRoute>
          <PerformanceDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/performance/history"
      element={
        <ProtectedRoute>
          <PerformanceHistoryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/performance/review/:id"
      element={
        <ProtectedRoute>
          <PerformanceReviewDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/performance/new"
      element={
        <ProtectedRoute>
          <PerformanceNewReviewPage />
        </ProtectedRoute>
      }
    />

    {/* ================= Payroll ⭐ NEW ================= */}
    <Route
      path="/payroll"
      element={
        <ProtectedRoute>
          <PayrollDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/reimbursement"
      element={
        <ProtectedRoute>
          <ReimbursementStatusPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/structure"
      element={
        <ProtectedRoute>
          <SalaryStructurePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/payslips"
      element={
        <ProtectedRoute>
          <PayrollSlipsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/record"
      element={
        <ProtectedRoute>
          <RecordPaymentPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/pending"
      element={
        <ProtectedRoute>
          <PendingPaymentsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payroll/overview"
      element={
        <ProtectedRoute>
          <PayrollOverviewPage />
        </ProtectedRoute>
      }
    />
    {/* ================= Settings ================= */}
    {/* ── Settings ── */}
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <SettingsDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings/users/new"
      element={
        <ProtectedRoute>
          <UserManagementPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings/company"
      element={
        <ProtectedRoute>
          <CompanyDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings/permissions"
      element={
        <ProtectedRoute>
          <PermissionsManagerPage />
        </ProtectedRoute>
      }
    />
  </>
);

export default HomeRoutes;
