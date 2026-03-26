// src/hooks/useLeaves.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as leaveApi from "@/services/leaveApi";

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leaveRequests"],
    queryFn: leaveApi.getLeaveRequests,
  });
}

export function useLeaveRequest(id) {
  return useQuery({
    queryKey: ["leaveRequest", id],
    queryFn: () => leaveApi.getLeaveRequestById(id),
    enabled: !!id,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveApi.createLeaveRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaveRequests"] }),
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveApi.updateLeaveStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaveRequests"] }),
  });
}