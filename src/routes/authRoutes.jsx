import { Route } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { PasswordResetSuccess } from "../pages/auth/passwordResetSuccess";
import { VerificationPending } from "../pages/auth/VerificationPending";
import { VerificationSuccess } from "../pages/auth/VerificationSuccess";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import { PasswordResetValidate } from "../pages/auth/PasswordResetValidate";
import { PasswordResetNew } from "../pages/auth/PasswordResetNew";

const authRoutes = (
  <Route path="/auth" element={<AuthLayout />}>
    <Route index element={<Login />} />
    <Route path="signup" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="password-confirmada" element={<PasswordResetSuccess />} />
    <Route path="password-reset-validate" element={<PasswordResetValidate />} />
    <Route path="password-reset-new" element={<PasswordResetNew />} />
    <Route path="verification-pending" element={<VerificationPending />} />
    <Route path="verification-success" element={<VerificationSuccess />} />
    <Route path="restablecer/:token" element={<VerificationSuccess />} />
  </Route>
);

export default authRoutes;