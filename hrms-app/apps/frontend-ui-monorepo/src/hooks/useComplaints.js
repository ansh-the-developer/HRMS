import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as complaintApi from "@/services/complaintApi";

export function useComplaintsList(enabled = true) {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: complaintApi.getComplaints,
    enabled,
  });
}

export function useComplaint(caseId) {
  return useQuery({
    queryKey: ["complaint", caseId],
    queryFn: () => complaintApi.getComplaintByCaseId(caseId),
    enabled: !!caseId,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: complaintApi.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => complaintApi.updateComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}
