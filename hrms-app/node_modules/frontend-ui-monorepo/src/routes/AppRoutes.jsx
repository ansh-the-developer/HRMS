import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth pages
import LoginPage from "@/features/auth/pages/LoginPage";
import TwoFactorPage from "@/features/auth/pages/TwoFactorPage";
import MFAEnrollPage from "@/features/auth/pages/MFAEnrollPage";
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "@/features/auth/pages/PasswordChangedPage";

// All protected routes
import HomeRoutes from "./HomeRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Root redirect ──────────────────────────── */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ── Auth routes (fully public) ─────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ── Mid-flow auth pages (must stay unguarded) ─ */}
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/enroll-mfa" element={<MFAEnrollPage />} />
      <Route path="/verify-mfa" element={<TwoFactorPage />} />

      {/* ── Token-based pages (no auth guard) ──────── */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />

      {/* ── All protected app routes ───────────────── */}
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
