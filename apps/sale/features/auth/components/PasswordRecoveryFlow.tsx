"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "./AuthLayout";
import { EmailRequestForm } from "./EmailRequestForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function PasswordRecoveryFlow() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);

  if (email) {
    return (
      <AuthLayout variant="login" compact>
        <ResetPasswordForm key={email} email={email} onChangeEmail={() => setEmail(null)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="login">
      <EmailRequestForm initialEmail={searchParams.get("email") ?? ""} onSent={setEmail} />
    </AuthLayout>
  );
}
