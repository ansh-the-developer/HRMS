import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Center, Spinner } from "@chakra-ui/react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth pages
import LoginPage           from "@/features/auth/pages/LoginPage";
import TwoFactorPage       from "@/features/auth/pages/TwoFactorPage";
import MFAEnrollPage       from "@/features/auth/pages/MFAEnrollPage";
import ChangePasswordPage  from "@/features/auth/pages/ChangePasswordPage";
import VerifyEmailPage     from "@/features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage  from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage   from "@/features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "@/features/auth/pages/PasswordChangedPage";

// All protected routes
import HomeRoutes from "./HomeRoutes";

// ── Guards unauthenticated users away from /login only ──
// Does NOT redirect authenticated users — LoginPage handles
// its own post-login routing (change-password → enroll-mfa → home)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  // ✅ REMOVED: no redirect to /home here
  // LoginPage itself decides where to go after sign-in
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Root redirect ──────────────────────────── */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ── Auth routes (fully public — no guard) ─────
           LoginPage handles its own post-login routing:
           /change-password → /enroll-mfa → /verify-mfa → /home */}
      <Route path="/login"            element={<LoginPage />} />
      <Route path="/forgot-password"  element={<ForgotPasswordPage />} />

      {/* ── Mid-flow auth pages (must stay unguarded) ─
           These are reached programmatically after login,
           not by direct URL. No PublicOnlyRoute needed.  */}
      <Route path="/change-password"  element={<ChangePasswordPage />} />
      <Route path="/enroll-mfa"       element={<MFAEnrollPage />} />
      <Route path="/verify-mfa"       element={<TwoFactorPage />} />

      {/* ── Token-based pages (no auth guard) ─────────
           reset-password needs the Supabase hash token
           so it must NEVER be behind ProtectedRoute      */}
      <Route path="/verify-email"     element={<VerifyEmailPage />} />
      <Route path="/reset-password"   element={<ResetPasswordPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />

      {/* ── All protected app routes ───────────────────
           catch-all passes to HomeRoutes which has its
           own <Routes> matching absolute paths          */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <HomeRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;