// src/services/homeApi.js
import { supabase } from "@/lib/supabaseClient";

/* ---------- NOTICES (Notice Board) ---------- */

export async function getNotices() {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createNotice(payload) {
  const { data, error } = await supabase
    .from("notices")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ---------- HOLIDAYS ---------- */

export async function getHolidays() {
  const { data, error } = await supabase
    .from("holidays")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createHoliday(payload) {
  const { data, error } = await supabase
    .from("holidays")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ---------- COMPANY EVENTS ---------- */

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ---------- BIRTHDAYS + EMPLOYEE LINK ---------- */

// Get birthdays for a specific date (YYYY-MM-DD), with employee info if linked
export async function getBirthdaysByDate(date) {
  const { data, error } = await supabase
    .from("birthdays")
    .select(`
      id,
      person_name,
      date_of_birth,
      employee_id,
      employees:employee_id (
        id,
        name,
        email,
        department,
        designation
      )
    `)
    .eq("date_of_birth", date)
    .order("person_name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createBirthday(payload) {
  const { data, error } = await supabase
    .from("birthdays")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
