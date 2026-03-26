// src/services/employeeApi.js
import { supabase } from "@/lib/supabaseClient";

export async function getEmployees({ filterType, filterValue } = {}) {
  let query = supabase
    .from("employees")
    .select("id, name, email, department, designation, birthdate")  // ✅ ADDED birthdate
    .order("name", { ascending: true });

  if (filterType === "department" && filterValue) {
    query = query.eq("department", filterValue);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getEmployeeById(id) {
  const { data, error } = await supabase
    .from("employees")
    .select("id, name, email, department, designation, birthdate")  // ✅ ADDED birthdate
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createEmployee(payload) {
  const { data, error } = await supabase
    .from("employees")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEmployee(id, updates) {
  const { data, error } = await supabase
    .from("employees")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEmployee(id) {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
