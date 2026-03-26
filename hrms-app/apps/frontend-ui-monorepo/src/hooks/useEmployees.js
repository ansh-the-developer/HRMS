// src/hooks/useEmployees.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as employeeApi from "@/services/employeeApi";

export function useEmployees({ filterType, filterValue } = {}) {
  return useQuery({
    queryKey: ["employees", { filterType, filterValue }],
    queryFn: () => employeeApi.getEmployees({ filterType, filterValue }),
  });
}

export function useEmployee(id) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => employeeApi.updateEmployee(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}