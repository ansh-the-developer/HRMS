// src/services/employeeApi.js
import { supabase } from "@/lib/supabaseClient";

export async function getEmployees({ filterType, filterValue } = {}) {
  let query = supabase
    .from("employees")
    .select("id, name, email, department, designation, birthdate, department_id, branch_id")
    .order("name", { ascending: true });

  if (filterType === "department" && filterValue) {
    query = query.eq("department", filterValue);
  }
  if (filterType === "designation" && filterValue) {
    query = query.eq("designation", filterValue);
  }
  if (filterType === "branch" && filterValue) {
    query = query.eq("branch_id", filterValue);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getEmployeeById(id) {
  const { data, error } = await supabase
    .from("employees")
    .select("id, name, email, department, designation, birthdate, department_id, branch_id")
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

// src/services/employeeApi.js → Your version + 2 improvements
export async function deleteEmployee(id) {
  const shortId = id.slice(0,8);
  
  try {
    // 1. Handle known child tables (ignore missing ones)
    const childTables = ['performance_reviews']; // Add others as you find them
    
    for (const table of childTables) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('employee_id', id);
        
        if (!error && import.meta.env.DEV) {  // ✅ Only log in dev
          console.log(`✅ Cleared ${table}`);
        }
      } catch (e) {
        // Table doesn't exist → skip silently
      }
    }
    
    // 2. NULL FKs on employee itself
    const { error: updateError } = await supabase  // ✅ Capture error
      .from("employees")
      .update({ branch_id: null, department_id: null })
      .eq("id", id);
    
    if (updateError && import.meta.env.DEV) {
      console.warn(`⚠️ Update FKs failed:`, updateError.message);
    }
    
    // 3. Delete
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    
    if (!error) {
      if (import.meta.env.DEV) {
        console.log(`✅ Employee ${shortId} deleted`);
      }
      return true;
    }
    
    throw error;
  } catch (err) {
    console.error(`❌ Delete failed ${shortId}:`, err.message);
    throw err;
  }
}