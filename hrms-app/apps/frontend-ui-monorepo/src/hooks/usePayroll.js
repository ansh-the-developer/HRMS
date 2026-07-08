// src/hooks/usePayroll.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSalaryStructure,
  saveSalaryStructure,
  getPayrollRuns,
  getPayrollRunDetails,
  generatePayrollForMonth,
  updatePayrollRunStatus,
  lockPayrollRun,
  getEmployeePayslips,
  updatePayslipPaymentStatus,
  getPendingPayslips,
  getPaidPayslips,
} from "@/services/payrollApi";

export function useSalaryStructure(employeeId) {
  return useQuery({
    queryKey: ["salaryStructure", employeeId],
    queryFn: () => getSalaryStructure(employeeId),
    enabled: !!employeeId,
  });
}

export function useSaveSalaryStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, payload }) => saveSalaryStructure(employeeId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["salaryStructure", variables.employeeId] });
    },
  });
}

export function usePayrollRuns() {
  return useQuery({
    queryKey: ["payrollRuns"],
    queryFn: getPayrollRuns,
  });
}

export function usePayrollRunDetails(month) {
  return useQuery({
    queryKey: ["payrollRunDetails", month],
    queryFn: () => getPayrollRunDetails(month),
    enabled: !!month,
  });
}

export function useGeneratePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (month) => generatePayrollForMonth(month),
    onSuccess: (data, month) => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      queryClient.invalidateQueries({ queryKey: ["payrollRunDetails", month] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
      queryClient.invalidateQueries({ queryKey: ["paidPayments"] });
    },
  });
}

export function useUpdatePayrollStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ month, status }) => updatePayrollRunStatus(month, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      queryClient.invalidateQueries({ queryKey: ["payrollRunDetails", variables.month] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
      queryClient.invalidateQueries({ queryKey: ["paidPayments"] });
    },
  });
}

export function useLockPayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (month) => lockPayrollRun(month),
    onSuccess: (data, month) => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      queryClient.invalidateQueries({ queryKey: ["payrollRunDetails", month] });
    },
  });
}

export function useEmployeePayslips(employeeId) {
  return useQuery({
    queryKey: ["employeePayslips", employeeId],
    queryFn: () => getEmployeePayslips(employeeId),
    enabled: !!employeeId,
  });
}

export function useUpdatePayslipPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => updatePayslipPaymentStatus(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payrollRunDetails", data.month] });
      queryClient.invalidateQueries({ queryKey: ["employeePayslips", data.employee_id] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
      queryClient.invalidateQueries({ queryKey: ["paidPayments"] });
    },
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ["pendingPayments"],
    queryFn: getPendingPayslips,
  });
}

export function usePaidPayments() {
  return useQuery({
    queryKey: ["paidPayments"],
    queryFn: getPaidPayslips,
  });
}

