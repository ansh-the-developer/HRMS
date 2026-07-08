// src/services/attendanceApi.js
import { supabase } from "@/lib/supabaseClient";

/**
 * Fetches all attendance records for a specific date (YYYY-MM-DD).
 */
export async function getAttendanceForDate(dateStr) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", dateStr);
  
  if (error) {
    console.error("Error fetching attendance for date:", error.message);
    throw error;
  }
  return data;
}

/**
 * Inserts or updates a single attendance log record.
 * Expected keys: { employee_id, date, in_time, out_time, status }
 */
export async function upsertAttendanceRecord(logRecord) {
  const { data, error } = await supabase
    .from("attendance")
    .upsert(logRecord, { onConflict: "employee_id,date" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting attendance record:", error.message);
    throw error;
  }
  return data;
}

/**
 * Bulk inserts/updates multiple attendance log records.
 */
export async function bulkUpsertAttendance(logRecords) {
  if (!logRecords || logRecords.length === 0) return [];
  
  const { data, error } = await supabase
    .from("attendance")
    .upsert(logRecords, { onConflict: "employee_id,date" })
    .select();

  if (error) {
    console.error("Error bulk upserting attendance:", error.message);
    throw error;
  }
  return data;
}

/**
 * Deletes all attendance records for a specific date (resetting them).
 */
export async function deleteAttendanceForDate(dateStr) {
  const { data, error } = await supabase
    .from("attendance")
    .delete()
    .eq("date", dateStr);

  if (error) {
    console.error("Error deleting attendance for date:", error.message);
    throw error;
  }
  return data;
}

/**
 * Fetches attendance records within a specific date range.
 * Used for Month and FY CSV downloads.
 */
export async function getAttendanceForRange(startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error fetching attendance for range:", error.message);
    throw error;
  }
  return data;
}

/**
 * Deletes a single employee's attendance record on a given date.
 */
export async function deleteEmployeeAttendanceRecord(employeeId, dateStr) {
  const { data, error } = await supabase
    .from("attendance")
    .delete()
    .eq("employee_id", employeeId)
    .eq("date", dateStr);

  if (error) {
    console.error("Error deleting single employee attendance record:", error.message);
    throw error;
  }
  return data;
}

/**
 * Deletes all attendance records for a single employee within a date range (nuking).
 */
export async function deleteEmployeeAttendanceForRange(employeeId, startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance")
    .delete()
    .eq("employee_id", employeeId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error deleting employee attendance for range:", error.message);
    throw error;
  }
  return data;
}

/**
 * Fetches attendance records for a specific employee within a date range.
 */
export async function getAttendanceForEmployee(employeeId, startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching employee attendance:", error.message);
    throw error;
  }
  return data || [];
}
