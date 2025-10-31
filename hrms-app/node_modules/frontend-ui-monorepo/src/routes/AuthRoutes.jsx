import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import TwoFactorPage from "@/features/auth/pages/TwoFactorPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "@/features/auth/pages/PasswordChangedPage";

const AuthRoutes = () => (
  <>
    <Route path="/" element={<LoginPage />} />
    <Route path="/2fa" element={<TwoFactorPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/password-changed" element={<PasswordChangedPage />} />
  </>
);

export default AuthRoutes;
