import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Center, Spinner } from "@chakra-ui/react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth pages
import LoginPage           from "@/features/auth/pages/LoginPage";
import TwoFactorPage       from "@/features/auth/pages/TwoFactorPage";
import VerifyEmailPage     from "@/features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage  from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage   from "@/features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "@/features/auth/pages/PasswordChangedPage";

// All protected routes
import HomeRoutes from "./HomeRoutes";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Center h="100vh"><Spinner size="xl" color="blue.500" thickness="4px" /></Center>;
  }
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Root redirect ──────────────────────────── */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ── Auth routes (public only) ──────────────── */}
      <Route path="/login"            element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password"  element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />

      {/* ── Password + verify (no auth guard) ─────────
           reset-password needs the Supabase hash token
           so it must NEVER be behind ProtectedRoute      */}
      <Route path="/verify-mfa"        element={<TwoFactorPage />} />
      <Route path="/verify-email"      element={<VerifyEmailPage />} />
      <Route path="/reset-password"    element={<ResetPasswordPage />} />
      <Route path="/password-changed"  element={<PasswordChangedPage />} />

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
