import { supabase } from "@/lib/supabaseClient";

// Fetch all complaints (for HR/Manager)
export async function getComplaints() {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Fetch a single complaint by Case ID (for Employee anonymous tracking)
export async function getComplaintByCaseId(caseId) {
  if (!caseId) return null;
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("case_id", caseId.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Create a new complaint
export async function createComplaint(payload) {
  const { data, error } = await supabase
    .from("complaints")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update complaint status (Resolve / Dismiss)
export async function updateComplaintStatus(id, status) {
  const updates = { status };
  if (status === "Resolved") {
    updates.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("complaints")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
