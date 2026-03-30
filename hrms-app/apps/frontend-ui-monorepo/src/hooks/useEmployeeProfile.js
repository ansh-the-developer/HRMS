import { useQuery } from "@tanstack/react-query";
import { getEmployeeProfile } from "@/services/employeeApi";

export function useEmployeeProfile(id) {
  return useQuery({
    queryKey: ["employee-profile", id],
    queryFn: () => getEmployeeProfile(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}