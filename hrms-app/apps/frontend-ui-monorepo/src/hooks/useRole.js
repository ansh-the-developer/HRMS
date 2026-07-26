// src/hooks/useRole.js
import { useMemo, useState, useEffect, useCallback } from "react";
import { useProfile } from "@/services/useProfile";

export const PERSPECTIVE_KEY = "hrms_perspective";
export const PERSPECTIVE_CHANGE_EVENT = "hrms:perspective-change";

function readPerspective() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PERSPECTIVE_KEY);
}

export function setPerspective(value) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(PERSPECTIVE_KEY, value);
  } else {
    localStorage.removeItem(PERSPECTIVE_KEY);
  }
  window.dispatchEvent(new Event(PERSPECTIVE_CHANGE_EVENT));
}

export function clearPerspective() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PERSPECTIVE_KEY);
  window.dispatchEvent(new Event(PERSPECTIVE_CHANGE_EVENT));
}

export function useRole() {
  const { profile, isLoading, error } = useProfile();
  const [perspective, setPerspectiveState] = useState(readPerspective);

  useEffect(() => {
    const sync = () => setPerspectiveState(readPerspective());

    window.addEventListener(PERSPECTIVE_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(PERSPECTIVE_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const originalRole = profile?.role ?? "employee";

  const isSwitched =
    perspective === "employee" &&
    (originalRole === "hr" || originalRole === "manager");

  const role = isSwitched ? "employee" : originalRole;

  const switchToEmployee = useCallback(() => {
    if (originalRole === "hr" || originalRole === "manager") {
      setPerspective("employee");
    }
  }, [originalRole]);

  const switchToOriginal = useCallback(() => {
    clearPerspective();
  }, []);

  const toggleView = useCallback(() => {
    if (isSwitched) {
      switchToOriginal();
    } else {
      switchToEmployee();
    }
  }, [isSwitched, switchToEmployee, switchToOriginal]);

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

      canSwitchPerspective:
        originalRole === "hr" || originalRole === "manager",
      switchToEmployee,
      switchToOriginal,
      toggleView,

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
    [
      role,
      originalRole,
      isSwitched,
      isLoading,
      error,
      switchToEmployee,
      switchToOriginal,
      toggleView,
    ]
  );
}

export default useRole;