// src/hooks/useHome.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as homeApi from "@/services/homeApi";

export function useNotices() {
  return useQuery({
    queryKey: ["notices"],
    queryFn: homeApi.getNotices,
  });
}

export function useHolidays() {
  return useQuery({
    queryKey: ["holidays"],
    queryFn: homeApi.getHolidays,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: homeApi.getEvents,
  });
}

export function useBirthdaysByDate(date) {
  return useQuery({
    queryKey: ["birthdays", date],
    queryFn: () => homeApi.getBirthdaysByDate(date),
    enabled: !!date,
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: homeApi.createNotice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: homeApi.createHoliday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["holidays"] }),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: homeApi.createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}