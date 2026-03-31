import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/useAuthContext"; // ✅ updated path

export const useAuth = () => {
  const { session, user, isLoading, isAuthenticated } = useAuthContext();

  // ── Login ──────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  };

  // ── Forgot Password (sends reset email) ────────────────────────────────
  // Used in: ForgotPasswordPage.jsx
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  // ── Reset Password alias (same as forgotPassword) ──────────────────────
  // ForgotPasswordPage.jsx calls resetPassword(email) → maps here
  const resetPassword = forgotPassword;

  // ── Update Password (after clicking reset link) ────────────────────────
  // Used in: ResetPasswordPage.jsx → called as updatePassword(newPassword)
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  };

  // ── MFA — Enroll (generate QR code) ────────────────────────────────────
  const enrollMFA = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });
    if (error) throw error;
    return data; // { id, totp: { qr_code, secret } }
  };

  // ── MFA — Challenge (open a verify session) ────────────────────────────
  const challengeMFA = async (factorId) => {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) throw error;
    return data; // { id: challengeId }
  };

  // ── MFA — Verify (submit 6-digit TOTP code) ────────────────────────────
  const verifyMFA = async (factorId, challengeId, code) => {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });
    if (error) throw error;
    return data;
  };

  return {
    // ── State ──────────────────────────────────────
    session,
    user,
    isLoading,
    isAuthenticated,

    // ── Auth actions ───────────────────────────────
    signIn,
    signOut,

    // ── Password flow ──────────────────────────────
    forgotPassword,   // ForgotPasswordPage (sends email)
    resetPassword,    // alias → same as forgotPassword
    updatePassword,   // ResetPasswordPage  (saves new password)

    // ── MFA ────────────────────────────────────────
    enrollMFA,
    challengeMFA,
    verifyMFA,
  };
};