import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Role guard
import RoleRoute from "@/components/RoleRoute";

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

// Complaint Center & Pro Gates
import ComplaintCenterPage from "@/features/home/ComplaintCenterPage";
import ProFeatureGatePage from "@/features/home/ProFeatureGatePage";

const HomeRoutes = () => (
  <Routes>
    {/* Default */}
    <Route index element={<Navigate to="/home" replace />} />

    {/* Home - all authenticated roles */}
    <Route path="/home" element={<HomePage />} />

    {/* Employee - HR + Manager */}
    <Route
      path="/employees"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeListPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/departments"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeDepartmentsPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/branches"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeBranchesPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/designations"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeDesignationsPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/statuses"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeStatusesPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/types"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeTypesPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/export"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <EmployeeExportPage />
        </RoleRoute>
      }
    />
    <Route
      path="/employees/:id"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <EmployeeProfilePage />
        </RoleRoute>
      }
    />

    {/* Attendance - all roles for now */}
    <Route
      path="/attendance"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <AttendanceDashboardPage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/working-days"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <WorkingDaysPage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/working-days/edit"
      element={
        <RoleRoute allow={["hr"]}>
          <EditWorkingDaysPage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/working-hours"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <WorkingHoursPage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/working-rules"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <WorkingRulesPage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/working-rules/edit"
      element={
        <RoleRoute allow={["hr"]}>
          <EditWorkingRulePage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/edit"
      element={
        <RoleRoute allow={["hr"]}>
          <EditAttendancePage />
        </RoleRoute>
      }
    />
    <Route
      path="/attendance/export"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <AttendanceExportPage />
        </RoleRoute>
      }
    />

    {/* Leaves - all can access some, action pages restricted */}
    <Route
      path="/leaves"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <LeavesDashboardPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/required-form"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <LeaveRequiredFormPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/request-upload"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <LeaveRequestUploadPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/submit-status"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <LeaveSubmitStatusPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/requests"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <LeaveRequestListPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/requests/:id"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <LeaveRequestActionPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/rules"
      element={
        <RoleRoute allow={["hr"]}>
          <LeaveRulesPage />
        </RoleRoute>
      }
    />
    <Route
      path="/leaves/rules/approval-flow"
      element={
        <RoleRoute allow={["hr"]}>
          <LeaveRulesApprovalFlowPage />
        </RoleRoute>
      }
    />

    {/* Performance */}
    <Route
      path="/performance"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <PerformanceDashboardPage />
        </RoleRoute>
      }
    />
    <Route
      path="/performance/history"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <PerformanceHistoryPage />
        </RoleRoute>
      }
    />
    <Route
      path="/performance/review/:id"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <PerformanceReviewDetailPage />
        </RoleRoute>
      }
    />
    <Route
      path="/performance/new"
      element={
        <RoleRoute allow={["hr", "manager"]}>
          <PerformanceNewReviewPage />
        </RoleRoute>
      }
    />

    {/* Payroll - HR + Employee, NO Manager */}
    <Route
      path="/payroll"
      element={
        <RoleRoute allow={["hr", "employee"]}>
          <PayrollDashboardPage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/reimbursement"
      element={
        <RoleRoute allow={["hr", "employee"]}>
          <ReimbursementStatusPage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/structure"
      element={
        <RoleRoute allow={["hr"]}>
          <SalaryStructurePage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/payslips"
      element={
        <RoleRoute allow={["hr", "employee"]}>
          <PayrollSlipsPage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/record"
      element={
        <RoleRoute allow={["hr"]}>
          <RecordPaymentPage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/pending"
      element={
        <RoleRoute allow={["hr"]}>
          <PendingPaymentsPage />
        </RoleRoute>
      }
    />
    <Route
      path="/payroll/overview"
      element={
        <RoleRoute allow={["hr"]}>
          <PayrollOverviewPage />
        </RoleRoute>
      }
    />

    {/* Settings - HR only */}
    <Route
      path="/settings"
      element={
        <RoleRoute allow={["hr"]}>
          <SettingsDashboardPage />
        </RoleRoute>
      }
    />
    <Route
      path="/settings/users/new"
      element={
        <RoleRoute allow={["hr"]}>
          <UserManagementPage />
        </RoleRoute>
      }
    />
    <Route
      path="/settings/company"
      element={
        <RoleRoute allow={["hr"]}>
          <CompanyDetailsPage />
        </RoleRoute>
      }
    />
    <Route
      path="/settings/permissions"
      element={
        <RoleRoute allow={["hr"]}>
          <PermissionsManagerPage />
        </RoleRoute>
      }
    />
    {/* Complaint Center - accessible by all */}
    <Route
      path="/complaints"
      element={
        <RoleRoute allow={["hr", "manager", "employee"]}>
          <ComplaintCenterPage />
        </RoleRoute>
      }
    />

    {/* Gated Pro Features */}
    <Route
      path="/employees/documents"
      element={
        <RoleRoute allow={["hr"]}>
          <ProFeatureGatePage />
        </RoleRoute>
      }
    />
    <Route
      path="/activity-logs"
      element={
        <RoleRoute allow={["hr"]}>
          <ProFeatureGatePage />
        </RoleRoute>
      }
    />

    {/* Unknown protected path */}
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default HomeRoutes;
