import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage           from "@/features/auth/pages/LoginPage";         // ✅ fixed typo (extra ' removed)
import TwoFactorPage       from "@/features/auth/pages/TwoFactorPage";
import MFAEnrollPage       from "@/features/auth/pages/MFAEnrollPage";     // ✅ NEW
import VerifyEmailPage     from "@/features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage  from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage   from "@/features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "@/features/auth/pages/PasswordChangedPage";

const AuthRoutes = () => {
  return (
    <Routes>
      {/* ── Core auth ────────────────────────────────── */}
      <Route path="login"            element={<LoginPage />} />
      <Route path="verify-mfa"       element={<TwoFactorPage />} />
      <Route path="enroll-mfa"       element={<MFAEnrollPage />} />         {/* ✅ NEW */}
      <Route path="verify-email"     element={<VerifyEmailPage />} />

      {/* ── Password flow ────────────────────────────── */}
      <Route path="forgot-password"  element={<ForgotPasswordPage />} />
      <Route path="reset-password"   element={<ResetPasswordPage />} />
      <Route path="password-changed" element={<PasswordChangedPage />} />

      {/* ── Fallback ─────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;