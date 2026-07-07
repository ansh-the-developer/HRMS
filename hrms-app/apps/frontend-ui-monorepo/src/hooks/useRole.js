// src/hooks/useRole.js
import { useMemo } from "react";
import { useProfile } from "@/services/useProfile";

export function useRole() {
  const { profile, isLoading, error } = useProfile();

  const originalRole = profile?.role ?? "employee";

  // Check if there is a local storage override for role perspective
  const switchedView = typeof window !== "undefined" ? localStorage.getItem("hrms_switched_view") : null;
  const isSwitched = switchedView === "employee" && (originalRole === "hr" || originalRole === "manager");
  const role = isSwitched ? "employee" : originalRole;

  return useMemo(
    () => ({
      role,
      originalRole,
      isSwitched,
      isLoading,
      error,
      isHR: role === "hr",
      isManager: role === "manager",
      isEmployee: role === "employee",
      isOriginalHR: originalRole === "hr",
      isOriginalManager: originalRole === "manager",

      canViewEmployees: ["hr", "manager"].includes(role),
      canEditEmployees: role === "hr",

      canViewAttendance: ["hr", "manager", "employee"].includes(role),
      canManageAttendance: role === "hr",

      canViewLeaves: ["hr", "manager", "employee"].includes(role),
      canApproveLeaves: ["hr", "manager"].includes(role),

      canViewPayroll: ["hr", "employee"].includes(role),
      canManagePayroll: role === "hr",

      canViewPerformance: ["hr", "manager", "employee"].includes(role),
      canManagePerformance: ["hr", "manager"].includes(role),
    }),
    [role, originalRole, isSwitched, isLoading, error]
  );
}

export default useRole;