import { Route } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { PasswordResetSuccess } from "../pages/auth/passwordResetSuccess";
import { VerificationPending } from "../pages/auth/VerificationPending";
import { VerificationSuccess } from "../pages/auth/VerificationSuccess";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";

const authRoutes = (
  <Route path="/auth" element={<AuthLayout />}>
    <Route index element={<Login />} />
    <Route path="signup" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="password-confirmada" element={<PasswordResetSuccess />} />
    <Route path="verification-pending" element={<VerificationPending />} />
    <Route path="verification-success" element={<VerificationSuccess />} />
  </Route>
);

export default authRoutes;