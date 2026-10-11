"use client";

import { useSearchParams } from "next/navigation";
import { usePasswordRecoveryFlow } from "@workspace/core/hooks/usePasswordRecoveryFlow";
import { RecoveryEmailForm } from "@workspace/ui/components/auth/RecoveryEmailForm";
import { RecoveryResetForm } from "@workspace/ui/components/auth/RecoveryResetForm";
import { AuthLayout } from "./AuthLayout";

export function PasswordRecoveryFlow() {
  const searchParams = useSearchParams();
  const flow = usePasswordRecoveryFlow();

  return (
    <AuthLayout compact>
      {flow.email ? (
        <RecoveryResetForm
          key={flow.email}
          email={flow.email}
          pending={flow.isResetPending}
          resendPending={flow.isRequestPending}
          sendCooldownSeconds={flow.sendCooldownSeconds}
          verifyCooldownSeconds={flow.verifyCooldownSeconds}
          feedback={flow.resetFeedback}
          onChangeEmail={flow.changeEmail}
          onResend={flow.resendCode}
          onReset={flow.resetPassword}
        />
      ) : (
        <RecoveryEmailForm
          initialEmail={searchParams.get("email") ?? ""}
          portalName="Staff"
          pending={flow.isRequestPending}
          cooldownSeconds={flow.sendCooldownSeconds}
          requestError={flow.requestError}
          onSend={flow.requestCode}
          onClearError={flow.clearRequestError}
        />
      )}
    </AuthLayout>
  );
}
