// src/hooks/usePerformance.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as performanceApi from "@/services/performanceApi";

export function usePerformanceReviews() {
  return useQuery({
    queryKey: ["performanceReviews"],
    queryFn: performanceApi.getPerformanceReviews,
  });
}

export function usePerformanceReview(id) {
  return useQuery({
    queryKey: ["performanceReview", id],
    queryFn: () => performanceApi.getPerformanceReviewById(id),
    enabled: !!id,
  });
}

export function useCreatePerformanceReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: performanceApi.createPerformanceReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["performanceReviews"] }),
  });
}

export function useUpdatePerformanceReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: performanceApi.updatePerformanceReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["performanceReviews"] }),
  });
}