import { useQuery } from "@tanstack/react-query";
import { getEmployeeProfile } from "@/services/employeeApi";

export function useEmployeeProfile(id, userEmail = null) {
  return useQuery({
    queryKey: ["employee-profile", id, userEmail],
    queryFn: () => getEmployeeProfile(id, userEmail),
    enabled: !!id || !!userEmail,
    staleTime: 1000 * 60 * 5,
  });
}