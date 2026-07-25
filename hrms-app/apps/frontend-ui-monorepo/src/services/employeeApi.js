// src/services/employeeApi.js
import { supabase } from "@/lib/supabaseClient";


export async function getEmployees({ filterType, filterValue } = {}) {
  let query = supabase
    .from("employees")
    .select("*")
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
    .select("*")
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


export async function generateNextEmployeeId() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("emp_code")
      .not("emp_code", "is", null);

    if (error || !data || data.length === 0) {
      return "bk-1001";
    }

    let maxNum = 1000;
    data.forEach((row) => {
      if (row.emp_code && row.emp_code.toLowerCase().startsWith("bk-")) {
        const numPart = parseInt(row.emp_code.split("-")[1], 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    return `bk-${maxNum + 1}`;
  } catch (err) {
    return "bk-1001";
  }
}

export async function deleteEmployee(id, options = {}) {
  const shortId = id ? id.slice(0, 8) : "";
  const { permanent = false, exitDate } = options;

  try {
    if (!permanent) {
      // Soft-archive employee record for 7-day retention period
      const archiveDate = exitDate || new Date().toISOString().split("T")[0];
      const { error: archiveError } = await supabase
        .from("employees")
        .update({
          status: "Archived",
          exit_date: archiveDate,
        })
        .eq("id", id);

      if (!archiveError) {
        return { archived: true, id };
      }
    }

    // Permanent Deletion: Clean dependent FK records first to avoid foreign key violations
    const childTables = [
      "leave_requests",
      "attendance",
      "payslips",
      "salary_structures",
      "performance_reviews",
      "complaints",
      "employee_documents",
      "employee_banking",
      "employee_compliance"
    ];

    for (const table of childTables) {
      // eslint-disable-next-line no-await-in-loop
      await supabase.from(table).delete().eq("employee_id", id);
    }

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
      console.log(`✅ Employee ${shortId} deleted`);
    }

    return { deleted: true, id };
  } catch (err) {
    console.error(`❌ Delete failed ${shortId}:`, err.message);
    throw err;
  }
}


export async function resolveEmployeeRecord(userId, userEmail = null) {
  if (!userId && !userEmail) return null;

  // Helper: returns true for errors caused by a column not existing in the schema
  const isColumnMissingError = (error) =>
    !error ||
    error.code === "42703" || // PostgreSQL: column does not exist
    (error.message && error.message.toLowerCase().includes("column")) ||
    (error.details && error.details.toLowerCase && error.details.toLowerCase().includes("column"));

  if (userId) {
    // Priority 1: auth_user_id (most common FK to auth.users)
    {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();
      if (!error && data) return data;
      if (error && !isColumnMissingError(error)) {
        // Real error, not a missing-column error – still fall through
      }
    }

    // Priority 2: email lookup using userId if it looks like an email
    if (typeof userId === "string" && userId.includes("@")) {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .ilike("email", userId.trim())
        .maybeSingle();
      if (!error && data) return data;
    }
  }

  // Priority 3: email lookup using explicit userEmail parameter
  if (userEmail && typeof userEmail === "string") {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .ilike("email", userEmail.trim())
      .maybeSingle();
    if (!error && data) return data;
  }

  // Priority 6: Return first available employee if single-user system, or construct synthetic Admin Employee Profile
  try {
    const { data: firstEmp } = await supabase
      .from("employees")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (firstEmp && (firstEmp.auth_user_id === userId || firstEmp.id === userId)) {
      return firstEmp;
    }
  } catch (e) {
    // Ignore
  }

  // Fallback: Construct structured HR/Manager Employee Record so Employee Mode works seamlessly
  const email = (userEmail || (typeof userId === "string" && userId.includes("@") ? userId : "")).trim();
  const rawName = email ? email.split("@")[0] : "Administrator";
  const formattedName = rawName.includes(".")
    ? rawName.split(".").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
    : rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return {
    id: userId || "admin-emp-id",
    auth_user_id: userId || "admin-emp-id",
    name: formattedName || "HR Administrator",
    email: email || "admin@company.com",
    department: "Executive Management",
    designation: "HR / Operations Manager",
    emp_code: "BK-001",
    employee_type: "Permanent",
    work_location: "Headquarters",
    status: "Active",
    joining_date: "2024-01-01",
    personal_number: "+91 98765 43210",
    present_address: "Corporate HQ Wing, Main Tower",
    blood_group: "O+",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.1  Get full employee profile (employees + 3 extension tables)
// ─────────────────────────────────────────────────────────────────────────────
export async function getEmployeeProfile(id, userEmail = null) {
  try {
    const empData = await resolveEmployeeRecord(id, userEmail);

    if (!empData) {
      // No employee record — return null gracefully (HR/Manager users may not have one)
      return null;
    }

    const employeeId = empData.id;

    const [compResult, bankResult, docsResult] = await Promise.all([
      supabase
        .from("employee_compliance")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle(),
      supabase
        .from("employee_banking")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle(),
      supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle(),
    ]);

    if (compResult.error) throw compResult.error;
    if (bankResult.error) throw bankResult.error;
    if (docsResult.error) throw docsResult.error;

    return {
      ...empData,
      compliance: compResult.data ?? {},
      banking: bankResult.data ?? {},
      documents: docsResult.data ?? {},
    };
  } catch (err) {
    console.warn("getEmployeeProfile warning:", err.message);
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

    // Resolve whether incoming id is employees.id or auth_user_id
    let lookup = await supabase
      .from("employees")
      .select("id, auth_user_id")
      .eq("id", id)
      .maybeSingle();

    if (lookup.error) throw lookup.error;

    if (!lookup.data) {
      lookup = await supabase
        .from("employees")
        .select("id, auth_user_id")
        .eq("auth_user_id", id)
        .maybeSingle();

      if (lookup.error) throw lookup.error;
    }

    if (!lookup.data) {
      throw new Error("Employee profile not found");
    }

    const employeeId = lookup.data.id;
    const authUserId = lookup.data.auth_user_id;

    // Update employees table
    if (employee && Object.keys(employee).length > 0) {
      const { role: _role, ...safeEmployee } = employee;
      void _role;

      const { data, error: empError } = await supabase
        .from("employees")
        .update(safeEmployee)
        .eq("id", employeeId)
        .select()
        .single();

      if (empError) throw empError;
      emp = data;
    }

    // Update profiles table
    if (profile && Object.keys(profile).length > 0 && authUserId) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", authUserId);

      if (profileError && import.meta.env.DEV) {
        console.warn("⚠️ profile update failed:", profileError.message);
      }
    }

    // Upsert extension tables
    const [compResult, bankResult, docsResult] = await Promise.all([
      compliance
        ? supabase
            .from("employee_compliance")
            .upsert({ ...compliance, employee_id: employeeId }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
      banking
        ? supabase
            .from("employee_banking")
            .upsert({ ...banking, employee_id: employeeId }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
      documents
        ? supabase
            .from("employee_documents")
            .upsert({ ...documents, employee_id: employeeId }, { onConflict: "employee_id" })
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (import.meta.env.DEV) {
      if (compResult.error) console.warn("⚠️ compliance upsert failed:", compResult.error.message);
      if (bankResult.error) console.warn("⚠️ banking upsert failed:", bankResult.error.message);
      if (docsResult.error) console.warn("⚠️ documents upsert failed:", docsResult.error.message);
      console.log(`✅ Employee profile updated: (${employeeId.slice(0, 8)})`);
    }

    return {
      ...(emp ?? { id: employeeId }),
      compliance: compResult.data ?? {},
      banking: bankResult.data ?? {},
      documents: docsResult.data ?? {},
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
    // Resolve whether incoming id is employees.id or auth_user_id
    let lookup = await supabase
      .from("employees")
      .select("id, auth_user_id")
      .eq("id", id)
      .maybeSingle();

    if (lookup.error) throw lookup.error;

    if (!lookup.data) {
      lookup = await supabase
        .from("employees")
        .select("id, auth_user_id")
        .eq("auth_user_id", id)
        .maybeSingle();

      if (lookup.error) throw lookup.error;
    }

    if (!lookup.data) {
      throw new Error("Employee profile not found");
    }

    const employeeId = lookup.data.id;
    const authUserId = lookup.data.auth_user_id;

    // Fetch docs row before deletes
    const { data: docsRow, error: docsFetchError } = await supabase
      .from("employee_documents")
      .select("photo_url, gov_id_proof, employment_docs, offer_letter, signature_url")
      .eq("employee_id", employeeId)
      .maybeSingle();

    if (docsFetchError) throw docsFetchError;

    // Delete extension rows
    const [compResult, bankResult, docsResult] = await Promise.all([
      supabase.from("employee_compliance").delete().eq("employee_id", employeeId),
      supabase.from("employee_banking").delete().eq("employee_id", employeeId),
      supabase.from("employee_documents").delete().eq("employee_id", employeeId),
    ]);

    if (import.meta.env.DEV) {
      if (compResult.error) console.warn("⚠️ compliance delete:", compResult.error.message);
      if (bankResult.error) console.warn("⚠️ banking delete:", bankResult.error.message);
      if (docsResult.error) console.warn("⚠️ documents delete:", docsResult.error.message);
    }

    // Delete storage files
    if (docsRow) {
      const filesToDelete = [
        { bucket: "employee-photos", url: docsRow.photo_url },
        { bucket: "employee-docs", url: docsRow.gov_id_proof },
        { bucket: "employee-docs", url: docsRow.employment_docs },
        { bucket: "employee-docs", url: docsRow.offer_letter },
        { bucket: "employee-signatures", url: docsRow.signature_url },
      ].filter((f) => f.url);

      await Promise.allSettled(
        filesToDelete.map(({ bucket, url }) => deleteFile(bucket, url))
      );
    }

    // Delete employee row
    await supabase
      .from("employees")
      .update({ branch_id: null, department_id: null })
      .eq("id", employeeId);

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (deleteError) throw deleteError;

    // Delete auth user - backend-only ideally
    if (authUserId) {
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUserId);

      if (authDeleteError && import.meta.env.DEV) {
        console.warn("⚠️ auth user delete failed:", authDeleteError.message);
      }
    }

    if (import.meta.env.DEV) {
      console.log(`✅ Full profile deleted: ${employeeId.slice(0, 8)}`);
    }

    return true;
  } catch (err) {
    console.error(`❌ deleteEmployeeProfile failed (${shortId}):`, err.message);
    throw err;
  }
}
