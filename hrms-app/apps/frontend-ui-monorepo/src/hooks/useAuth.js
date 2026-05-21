import { useAuthContext } from "@/contexts/useAuthContext";
import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => {
  const { user, session, isLoading, isAuthenticated } = useAuthContext();

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const enrollMFA = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error) throw error;
    return data;
  };

  const challengeMFA = async (factorId) => {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) throw error;
    return data;
  };

  const verifyMFA = async (factorId, challengeId, code) => {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });
    if (error) throw error;
    return data;
  };

  const getMFALevel = async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw error;
    return data;
  };

  const listMFAFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;
    return data;
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    forgotPassword,
    resetPassword: forgotPassword,
    updatePassword,
    enrollMFA,
    challengeMFA,
    verifyMFA,
    getMFALevel,
    listMFAFactors,
  };
};