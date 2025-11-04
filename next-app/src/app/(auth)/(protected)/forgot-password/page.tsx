import { PageStructure } from "@/components/page-structure";
import { AuthCard } from "@/core/auth/components/auth-card";
import { ResetPasswordForm } from "@/core/auth/components/forms/reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
};

const ResetPasswordPage = () => {
  return (
    <PageStructure>
      <AuthCard
        title={"Forgot Password"}
        description={
          "Enter your email address to receive a password reset link."
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </PageStructure>
  );
};

export default ResetPasswordPage;
