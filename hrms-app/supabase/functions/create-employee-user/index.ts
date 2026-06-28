// @ts-nocheck

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  // ── Handle CORS preflight ────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, full_name, temp_password, role } = await req.json();

    // ── Validate required fields ─────────────────────
    if (!email || !full_name || !temp_password || !role) {
      return new Response(
        JSON.stringify({ error: "email, full_name, temp_password and role are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const allowedRoles = ["hr", "manager", "employee"];
    if (!allowedRoles.includes(String(role).toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be hr, manager, or employee" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Admin client (service role — server only) ────
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const normalizedRole = String(role).toLowerCase();

    let userId = null;
    let userWasCreated = false;

    // ── 1. Create auth user ──────────────────────────
    const { data: createdUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: temp_password,
        email_confirm: true,
      });

    if (createUserError) {
      const errMsg = createUserError.message || "";
      if (
        errMsg.toLowerCase().includes("already registered") ||
        errMsg.toLowerCase().includes("already exists") ||
        errMsg.toLowerCase().includes("already_exists")
      ) {
        // Find existing user by email
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          perPage: 1000,
        });
        if (!listError && listData?.users) {
          const existingUser = listData.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );
          if (existingUser) {
            userId = existingUser.id;
          }
        }
      }

      if (!userId) {
        return new Response(
          JSON.stringify({ error: createUserError.message || "Failed to create auth user" }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      userId = createdUser.user.id;
      userWasCreated = true;
    }

    // ── 2. Upsert into profiles ──────────────────────
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        full_name,
        role: normalizedRole,
        must_change_password: true,
      }, { onConflict: "id" });

    if (profileError) {
      // Rollback: delete auth user ONLY if we just created them in this request
      if (userWasCreated) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      }
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ── 3. Return the new user id ────────────────────
    return new Response(
      JSON.stringify({ user_id: userId }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unexpected error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});