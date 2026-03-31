import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session,   setSession]   = useState(undefined);
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ── 1. Get current session on mount ─────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // ── 2. Listen for all auth state changes ────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};