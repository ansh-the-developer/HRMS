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

// src/services/employeeApi.js

// ✅ 3.1 Get full employee profile (JOIN all 4 tables)
export async function getEmployeeProfile(id) {
  try {
    // Fetch all 4 tables in parallel
    const [
      { data: emp,        error: empError },
      { data: compliance, error: compError },
      { data: banking,    error: bankError },
      { data: documents,  error: docsError },
    ] = await Promise.all([
      supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single(),

      supabase
        .from("employee_compliance")
        .select("*")
        .eq("employee_id", id)
        .maybeSingle(),

      supabase
        .from("employee_banking")
        .select("*")
        .eq("employee_id", id)
        .maybeSingle(),

      supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", id)
        .maybeSingle(),
    ]);

    // Only employee is required, rest are optional
    if (empError) throw empError;

    return {
      ...emp,
      compliance: compliance || {},
      banking:    banking    || {},
      documents:  documents  || {},
    };
  } catch (err) {
    console.error("getEmployeeProfile error:", err.message);
    throw err;
  }
}

// ✅ 3.2 Create full employee profile (INSERT to all 4 tables)
export async function createEmployeeProfile(payload) {
  const { employee, compliance, banking, documents } = payload;

  try {
    // 1. Insert core employee first (get ID)
    const { data: emp, error: empError } = await supabase
      .from("employees")
      .insert(employee)
      .select()
      .single();
    if (empError) throw empError;

    const employee_id = emp.id;

    // 2. Insert extensions in parallel (only if data exists)
    const extensions = await Promise.all([

      // Compliance
      compliance ? supabase
        .from("employee_compliance")
        .insert({ ...compliance, employee_id })
        .select().single()
        : Promise.resolve({ data: null, error: null }),

      // Banking
      banking ? supabase
        .from("employee_banking")
        .insert({ ...banking, employee_id })
        .select().single()
        : Promise.resolve({ data: null, error: null }),

      // Documents
      documents ? supabase
        .from("employee_documents")
        .insert({ ...documents, employee_id })
        .select().single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Check extension errors
    extensions.forEach(({ error }, i) => {
      const tables = ["compliance", "banking", "documents"];
      if (error && import.meta.env.DEV) {
        console.warn(`⚠️ ${tables[i]} insert failed:`, error.message);
      }
    });

    if (import.meta.env.DEV) {
      console.log(`✅ Employee profile created: ${emp.name} (${emp.id.slice(0,8)})`);
    }

    return {
      ...emp,
      compliance: extensions[0].data || {},
      banking:    extensions[1].data || {},
      documents:  extensions[2].data || {},
    };

  } catch (err) {
    console.error("createEmployeeProfile error:", err.message);
    throw err;
  }
}

// ✅ 3.3 Update full employee profile (UPSERT all 4 tables)
export async function updateEmployeeProfile(id, payload) {
  const { employee, compliance, banking, documents } = payload;

  try {
    // 1. Update core employee
    const { data: emp, error: empError } = await supabase
      .from("employees")
      .update(employee)
      .eq("id", id)
      .select()
      .single();
    if (empError) throw empError;

    // 2. UPSERT extensions in parallel
    // UPSERT = INSERT if not exists, UPDATE if exists
    const extensions = await Promise.all([

      // Compliance
      compliance ? supabase
        .from("employee_compliance")
        .upsert(
          { ...compliance, employee_id: id },
          { onConflict: "employee_id" }
        )
        .select().single()
        : Promise.resolve({ data: null, error: null }),

      // Banking
      banking ? supabase
        .from("employee_banking")
        .upsert(
          { ...banking, employee_id: id },
          { onConflict: "employee_id" }
        )
        .select().single()
        : Promise.resolve({ data: null, error: null }),

      // Documents
      documents ? supabase
        .from("employee_documents")
        .upsert(
          { ...documents, employee_id: id },
          { onConflict: "employee_id" }
        )
        .select().single()
        : Promise.resolve({ data: null, error: null }),

    ]);

    // Check extension errors
    extensions.forEach(({ error }, i) => {
      const tables = ["compliance", "banking", "documents"];
      if (error && import.meta.env.DEV) {
        console.warn(`⚠️ ${tables[i]} upsert failed:`, error.message);
      }
    });

    if (import.meta.env.DEV) {
      console.log(`✅ Employee profile updated: ${emp.name} (${id.slice(0,8)})`);
    }

    return {
      ...emp,
      compliance: extensions[0].data || {},
      banking:    extensions[1].data || {},
      documents:  extensions[2].data || {},
    };

  } catch (err) {
    console.error("updateEmployeeProfile error:", err.message);
    throw err;
  }
}

// ✅ 3.4 Upload file to Supabase Storage → return public URL
export async function uploadFile(bucket, file, employeeId) {
  try {
    // Unique file path: employeeId/timestamp-filename
    const fileExt  = file.name.split(".").pop();
    const fileName = `${employeeId}/${Date.now()}.${fileExt}`;

    // 1. Upload to bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // overwrite if exists
      });

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (import.meta.env.DEV) {
      console.log(`✅ Uploaded to ${bucket}: ${data.publicUrl}`);
    }

    return data.publicUrl;

  } catch (err) {
    console.error(`❌ Upload failed (${bucket}):`, err.message);
    throw err;
  }
}

// ✅ 3.4b Delete file from Supabase Storage
export async function deleteFile(bucket, fileUrl) {
  try {
    // Extract file path from URL
    const path = fileUrl.split(`${bucket}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error && import.meta.env.DEV) {
      console.warn(`⚠️ Delete file failed (${bucket}):`, error.message);
    }
  } catch (err) {
    console.error(`❌ Delete file error:`, err.message);
  }
}

// ✅ 3.5 Delete full employee profile (all 4 tables + storage files)
export async function deleteEmployeeProfile(id) {
  const shortId = id.slice(0, 8);

  try {
    // 1. Fetch documents row first → get file URLs before deletion
    const { data: documents } = await supabase
      .from("employee_documents")
      .select("photo_url, gov_id_proof, employment_docs, offer_letter, signature_url")
      .eq("employee_id", id)
      .maybeSingle();

    // 2. Delete all extension table rows in parallel
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

    // 3. Delete storage files (best-effort, non-blocking)
    if (documents) {
      const filesToDelete = [
        { bucket: "employee-photos",     url: documents.photo_url },
        { bucket: "employee-docs",        url: documents.gov_id_proof },
        { bucket: "employee-docs",        url: documents.employment_docs },
        { bucket: "employee-docs",        url: documents.offer_letter },
        { bucket: "employee-signatures",  url: documents.signature_url },
      ].filter(f => f.url); // skip nulls/empty

      await Promise.allSettled(
        filesToDelete.map(({ bucket, url }) => deleteFile(bucket, url))
      );
    }

    // 4. NULL FKs then delete core employee
    await supabase
      .from("employees")
      .update({ branch_id: null, department_id: null })
      .eq("id", id);

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    if (import.meta.env.DEV) {
      console.log(`✅ Full profile deleted: ${shortId}`);
    }

    return true;

  } catch (err) {
    console.error(`❌ deleteEmployeeProfile failed (${shortId}):`, err.message);
    throw err;
  }
}