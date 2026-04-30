// src/hooks/useRole.js
import { useMemo } from "react";
import { useProfile } from "@/services/useProfile";

export function useRole() {
  const { profile, isLoading, error } = useProfile();

  const role = profile?.role ?? "employee";

  return useMemo(
    () => ({
      role,
      isLoading,
      error,
      isHR: role === "hr",
      isManager: role === "manager",
      isEmployee: role === "employee",

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
    [role, isLoading, error]
  );
}

export default useRole;