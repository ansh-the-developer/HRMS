import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ added Routes

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
import EmployeeProfilePage from "@/features/employee/components/EmployeeProfilePage";

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

// Payroll
import PayrollDashboardPage from "@/features/payroll/pages/PayrollDashboardPage";
import ReimbursementStatusPage from "@/features/payroll/pages/ReimbursementStatusPage";
import SalaryStructurePage from "@/features/payroll/pages/SalaryStructurePage";
import PayrollSlipsPage from "@/features/payroll/pages/PayrollSlipsPage";
import RecordPaymentPage from "@/features/payroll/pages/RecordPaymentPage";
import PendingPaymentsPage from "@/features/payroll/pages/PendingPaymentsPage";
import PayrollOverviewPage from "@/features/payroll/pages/PayrollOverviewPage";

// Settings
import SettingsDashboardPage from "@/features/settings/pages/SettingsDashboardPage";
import UserManagementPage from "@/features/settings/pages/UserManagementPage";
import CompanyDetailsPage from "@/features/settings/pages/CompanyDetailsPage";
import PermissionsManagerPage from "@/features/settings/pages/PermissionsManagerPage";

const HomeRoutes = () => (
  // ✅ Own <Routes> — matches absolute paths independently
  // ✅ No individual ProtectedRoute needed — AppRoutes wraps all of HomeRoutes
  <Routes>
    {/* ── Default redirect ──────────────────────── */}
    <Route index element={<Navigate to="/home" replace />} />

    {/* ── Home ──────────────────────────────────── */}
    <Route path="/home" element={<HomePage />} />

    {/* ── Employee ──────────────────────────────── */}
    <Route path="/employees" element={<EmployeeListPage />} />
    <Route
      path="/employees/departments"
      element={<EmployeeDepartmentsPage />}
    />
    <Route path="/employees/branches" element={<EmployeeBranchesPage />} />
    <Route
      path="/employees/designations"
      element={<EmployeeDesignationsPage />}
    />
    <Route path="/employees/statuses" element={<EmployeeStatusesPage />} />
    <Route path="/employees/types" element={<EmployeeTypesPage />} />
    <Route path="/employees/export" element={<EmployeeExportPage />} />
    <Route path="/employees/:id" element={<EmployeeProfilePage />} />

    {/* ── Attendance ────────────────────────────── */}
    <Route path="/attendance" element={<AttendanceDashboardPage />} />
    <Route path="/attendance/working-days" element={<WorkingDaysPage />} />
    <Route
      path="/attendance/working-days/edit"
      element={<EditWorkingDaysPage />}
    />
    <Route path="/attendance/working-hours" element={<WorkingHoursPage />} />
    <Route path="/attendance/working-rules" element={<WorkingRulesPage />} />
    <Route
      path="/attendance/working-rules/edit"
      element={<EditWorkingRulePage />}
    />
    <Route path="/attendance/edit" element={<EditAttendancePage />} />
    <Route path="/attendance/export" element={<AttendanceExportPage />} />

    {/* ── Leaves ────────────────────────────────── */}
    <Route path="/leaves" element={<LeavesDashboardPage />} />
    <Route path="/leaves/required-form" element={<LeaveRequiredFormPage />} />
    <Route path="/leaves/request-upload" element={<LeaveRequestUploadPage />} />
    <Route path="/leaves/submit-status" element={<LeaveSubmitStatusPage />} />
    <Route path="/leaves/requests" element={<LeaveRequestListPage />} />
    <Route path="/leaves/requests/:id" element={<LeaveRequestActionPage />} />
    <Route path="/leaves/rules" element={<LeaveRulesPage />} />
    <Route
      path="/leaves/rules/approval-flow"
      element={<LeaveRulesApprovalFlowPage />}
    />

    {/* ── Performance ───────────────────────────── */}
    <Route path="/performance" element={<PerformanceDashboardPage />} />
    <Route path="/performance/history" element={<PerformanceHistoryPage />} />
    <Route
      path="/performance/review/:id"
      element={<PerformanceReviewDetailPage />}
    />
    <Route path="/performance/new" element={<PerformanceNewReviewPage />} />

    {/* ── Payroll ───────────────────────────────── */}
    <Route path="/payroll" element={<PayrollDashboardPage />} />
    <Route
      path="/payroll/reimbursement"
      element={<ReimbursementStatusPage />}
    />
    <Route path="/payroll/structure" element={<SalaryStructurePage />} />
    <Route path="/payroll/payslips" element={<PayrollSlipsPage />} />
    <Route path="/payroll/record" element={<RecordPaymentPage />} />
    <Route path="/payroll/pending" element={<PendingPaymentsPage />} />
    <Route path="/payroll/overview" element={<PayrollOverviewPage />} />

    {/* ── Settings ──────────────────────────────── */}
    <Route path="/settings" element={<SettingsDashboardPage />} />
    <Route path="/settings/users/new" element={<UserManagementPage />} />
    <Route path="/settings/company" element={<CompanyDetailsPage />} />
    <Route path="/settings/permissions" element={<PermissionsManagerPage />} />

    {/* ── Unknown protected path → home ─────────── */}
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default HomeRoutes;
