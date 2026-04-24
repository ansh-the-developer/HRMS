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


export async function deleteEmployee(id) {
  const shortId = id.slice(0, 8);

  try {
    const childTables = ["performance_reviews"];

    for (const table of childTables) {
      // eslint-disable-next-line no-await-in-loop
      await supabase.from(table).delete().eq("employee_id", id);
      // Errors (e.g. table not found) are intentionally ignored here
    }

    const { error: nullFkError } = await supabase
      .from("employees")
      .update({ branch_id: null, department_id: null })
      .eq("id", id);

    if (nullFkError && import.meta.env.DEV) {
      console.warn("⚠️ Update FKs failed:", nullFkError.message);
    }

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    if (import.meta.env.DEV) {
      console.log(`✅ Employee ${shortId} deleted`);
    }

    return true;
  } catch (err) {
    console.error(`❌ Delete failed ${shortId}:`, err.message);
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.1  Get full employee profile (employees + 3 extension tables)
// ─────────────────────────────────────────────────────────────────────────────
export async function getEmployeeProfile(id) {
  try {
    const [empResult, compResult, bankResult, docsResult] = await Promise.all([
      supabase.from("employees").select("*").eq("id", id).single(),
      supabase.from("employee_compliance").select("*").eq("employee_id", id).maybeSingle(),
      supabase.from("employee_banking").select("*").eq("employee_id", id).maybeSingle(),
      supabase.from("employee_documents").select("*").eq("employee_id", id).maybeSingle(),
    ]);

    if (empResult.error) throw empResult.error;

    return {
      ...empResult.data,
      compliance: compResult.data  ?? {},
      banking:    bankResult.data  ?? {},
      documents:  docsResult.data  ?? {},
    };
  } catch (err) {
    console.error("getEmployeeProfile error:", err.message);
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.2  Create full employee profile
//
//  payload shape:
//  {
//    auth:       { email, password },   ← creates Supabase auth user
//    employee:   { name, email, … },    ← employees table  (NO role column)
//    profile:    { role },              ← profiles table   (role lives here)
//    compliance: { … },                 ← optional
//    banking:    { … },                 ← optional
//    documents:  { … },                 ← optional
//  }
// ─────────────────────────────────────────────────────────────────────────────
export async function createEmployeeProfile(payload) {
  const { auth: authPayload, employee, profile, compliance, banking, documents } = payload;

  try {
    // Step 1 — Create auth user & upsert profiles row
    let authUserId = employee.auth_user_id ?? null;

    if (authPayload?.email && authPayload?.password) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email:         authPayload.email,
        password:      authPayload.password,
        email_confirm: true,
      });
      if (authError) throw authError;

      authUserId = authData.user.id;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id:                   authUserId,
            role:                 profile?.role ?? "employee",
            must_change_password: true,
            ...(profile ?? {}),
          },
          { onConflict: "id" }
        );

      if (profileError && import.meta.env.DEV) {
        console.warn("⚠️ profile upsert failed:", profileError.message);
      }
    }

    // Step 2 — Build employees payload (strip role if caller included it by mistake)
    const { role: _role, ...safeEmployee } = employee;
    void _role; // intentionally unused — stripped to prevent schema error

    const { data: emp, error: empError } = await supabase
      .from("employees")
      .insert({ ...safeEmployee, ...(authUserId ? { auth_user_id: authUserId } : {}) })
      .select()
      .single();

    if (empError) throw empError;

    const employee_id = emp.id;

    // Step 3 — Insert extension rows in parallel
    const [compResult, bankResult, docsResult] = await Promise.all([
      compliance
        ? supabase.from("employee_compliance").insert({ ...compliance, employee_id }).select().single()
        : Promise.resolve({ data: null, error: null }),
      banking
        ? supabase.from("employee_banking").insert({ ...banking, employee_id }).select().single()
        : Promise.resolve({ data: null, error: null }),
      documents
        ? supabase.from("employee_documents").insert({ ...documents, employee_id }).select().single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (import.meta.env.DEV) {
      if (compResult.error) console.warn("⚠️ compliance insert failed:", compResult.error.message);
      if (bankResult.error) console.warn("⚠️ banking insert failed:",    bankResult.error.message);
      if (docsResult.error) console.warn("⚠️ documents insert failed:",  docsResult.error.message);
      console.log(`✅ Employee profile created: ${emp.name} (${emp.id.slice(0, 8)})`);
    }

    return {
      ...emp,
      compliance: compResult.data ?? {},
      banking:    bankResult.data ?? {},
      documents:  docsResult.data ?? {},
    };
  } catch (err) {
    console.error("createEmployeeProfile error:", err.message);
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.3  Update full employee profile
//
//  payload shape:
//  {
//    employee:   { name, email, … },  ← employees table  (NO role column)
//    profile:    { role },            ← profiles table   (role lives here)
//    compliance: { … },
//    banking:    { … },
//    documents:  { … },
//  }
// ─────────────────────────────────────────────────────────────────────────────
export async function updateEmployeeProfile(id, payload) {
  const { employee, profile, compliance, banking, documents } = payload;

  try {
    let emp = null;

    // Update employees table (strip role if accidentally included)
    if (employee && Object.keys(employee).length > 0) {
      const { role: _role, ...safeEmployee } = employee;
      void _role; // intentionally unused — stripped to prevent schema error

      const { data, error: empError } = await supabase
        .from("employees")
        .update(safeEmployee)
        .eq("id", id)
        .select()
        .single();

      if (empError) throw empError;
      emp = data;
    }

    // Update profiles table if role (or other profile fields) changed
    if (profile && Object.keys(profile).length > 0) {
      const { data: empRow } = await supabase
        .from("employees")
        .select("auth_user_id")
        .eq("id", id)
        .single();

      if (empRow?.auth_user_id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update(profile)
          .eq("id", empRow.auth_user_id);

        if (profileError && import.meta.env.DEV) {
          console.warn("⚠️ profile update failed:", profileError.message);
        }
      }
    }

    // Upsert extension tables in parallel
    const [compResult, bankResult, docsResult] = await Promise.all([
      compliance
        ? supabase
            .from("employee_compliance")
            .upsert({ ...compliance, employee_id: id }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
      banking
        ? supabase
            .from("employee_banking")
            .upsert({ ...banking, employee_id: id }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
      documents
        ? supabase
            .from("employee_documents")
            .upsert({ ...documents, employee_id: id }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (import.meta.env.DEV) {
      if (compResult.error) console.warn("⚠️ compliance upsert failed:", compResult.error.message);
      if (bankResult.error) console.warn("⚠️ banking upsert failed:",    bankResult.error.message);
      if (docsResult.error) console.warn("⚠️ documents upsert failed:",  docsResult.error.message);
      console.log(`✅ Employee profile updated: (${id.slice(0, 8)})`);
    }

    return {
      ...(emp ?? { id }),
      compliance: compResult.data ?? {},
      banking:    bankResult.data ?? {},
      documents:  docsResult.data ?? {},
    };
  } catch (err) {
    console.error("updateEmployeeProfile error:", err.message);
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.4  Upload file to Supabase Storage → returns public URL
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadFile(bucket, file, employeeId) {
  try {
    const fileExt  = file.name.split(".").pop();
    const fileName = `${employeeId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    if (import.meta.env.DEV) {
      console.log(`✅ Uploaded to ${bucket}: ${data.publicUrl}`);
    }

    return data.publicUrl;
  } catch (err) {
    console.error(`❌ Upload failed (${bucket}):`, err.message);
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.4b  Delete a single file from Supabase Storage
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteFile(bucket, fileUrl) {
  try {
    const path = fileUrl.split(`${bucket}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error && import.meta.env.DEV) {
      console.warn(`⚠️ Delete file failed (${bucket}):`, error.message);
    }
  } catch (err) {
    console.error("❌ Delete file error:", err.message);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3.5  Delete full employee profile
//      (extension rows + storage files + employee row + auth user)
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteEmployeeProfile(id) {
  const shortId = id.slice(0, 8);

  try {
    // Fetch data we need before any deletes
    const [{ data: docsRow }, { data: empRow }] = await Promise.all([
      supabase
        .from("employee_documents")
        .select("photo_url, gov_id_proof, employment_docs, offer_letter, signature_url")
        .eq("employee_id", id)
        .maybeSingle(),
      supabase
        .from("employees")
        .select("auth_user_id")
        .eq("id", id)
        .single(),
    ]);

    // Delete extension rows in parallel (cascade would handle this too, but explicit is safer)
    const [compResult, bankResult, docsResult] = await Promise.all([
      supabase.from("employee_compliance").delete().eq("employee_id", id),
      supabase.from("employee_banking").delete().eq("employee_id", id),
      supabase.from("employee_documents").delete().eq("employee_id", id),
    ]);

    if (import.meta.env.DEV) {
      if (compResult.error) console.warn("⚠️ compliance delete:", compResult.error.message);
      if (bankResult.error) console.warn("⚠️ banking delete:",    bankResult.error.message);
      if (docsResult.error) console.warn("⚠️ documents delete:",  docsResult.error.message);
    }

    // Delete storage files (best-effort — never blocks the main flow)
    if (docsRow) {
      const filesToDelete = [
        { bucket: "employee-photos",     url: docsRow.photo_url },
        { bucket: "employee-docs",       url: docsRow.gov_id_proof },
        { bucket: "employee-docs",       url: docsRow.employment_docs },
        { bucket: "employee-docs",       url: docsRow.offer_letter },
        { bucket: "employee-signatures", url: docsRow.signature_url },
      ].filter((f) => f.url);

      await Promise.allSettled(
        filesToDelete.map(({ bucket, url }) => deleteFile(bucket, url))
      );
    }

    // NULL out FKs then delete the core employee row
    await supabase
      .from("employees")
      .update({ branch_id: null, department_id: null })
      .eq("id", id);

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Delete the auth user (requires service-role key; silently skipped otherwise)
    if (empRow?.auth_user_id) {
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
        empRow.auth_user_id
      );
      if (authDeleteError && import.meta.env.DEV) {
        console.warn("⚠️ auth user delete failed:", authDeleteError.message);
      }
    }

    if (import.meta.env.DEV) {
      console.log(`✅ Full profile deleted: ${shortId}`);
    }

    return true;
  } catch (err) {
    console.error(`❌ deleteEmployeeProfile failed (${shortId}):`, err.message);
    throw err;
  }
}
