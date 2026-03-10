import { supabase } from "@/lib/supabaseClient";

// Get all reviews with employee details
export async function getPerformanceReviews() {
  const { data, error } = await supabase
    .from("performance_reviews")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        department,
        designation
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get single review by ID
export async function getPerformanceReviewById(id) {
  const { data, error } = await supabase
    .from("performance_reviews")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        department,
        designation
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Create new review
export async function createPerformanceReview(payload) {
  const { data, error } = await supabase
    .from("performance_reviews")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update review
export async function updatePerformanceReview(id, updates) {
  const { data, error } = await supabase
    .from("performance_reviews")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  return data;
}

// Add to performanceApi.js
export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("id, name, email")
    .order("name");
  if (error) throw error;
  return data;
}
