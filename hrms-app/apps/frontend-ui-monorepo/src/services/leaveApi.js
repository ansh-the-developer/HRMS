import { supabase } from "@/lib/supabaseClient";

// Get all leave requests with employee details
export async function getLeaveRequests() {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(
      `
      *,
      employees (
        id,
        name,
        email,
        department
      )
    `,
    )
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

// Create new leave request
export async function createLeaveRequest(payload) {
  const { data, error } = await supabase
    .from("leave_requests")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get single leave request by ID with employee
export async function getLeaveRequestById(id) {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(
      `
      *,
      employees (
        id,
        name,
        email,
        department,
        designation
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeaveStatus(id, status) {
  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  return data;
}


