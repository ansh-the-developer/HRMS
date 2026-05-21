
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

export async function updateNotice(id, updates) {
  const { data, error } = await supabase
    .from("notices")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();   // ← was .single()

  if (error) throw error;
  return data;
}

export async function deleteNotice(id) {
  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
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

export async function updateHoliday(id, updates) {
  const { data, error } = await supabase
    .from("holidays")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();          // ← same fix

  if (error) throw error;
  return data;
}

export async function deleteHoliday(id) {
  const { error } = await supabase
    .from("holidays")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
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

export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();          // ← same fix

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}


/* ---------- BIRTHDAYS + EMPLOYEE LINK ---------- */


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
