"use client";

import { useGoogleAuthFlow } from "@workspace/core/hooks/useGoogleAuthFlow";
import { GoogleIdentityControl } from "@workspace/ui/components/auth/GoogleIdentityControl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { GoogleLinkForm } from "./GoogleLinkForm";
import { useLmsAccessActivation } from "./AuthLayout";

export function GoogleAuthEntry({
  onLmsAccessNotActivated,
}: {
  onLmsAccessNotActivated?: () => void;
} = {}) {
  const openAccessActivationDialog = useLmsAccessActivation();
  const handleLmsNotActivated = onLmsAccessNotActivated ?? openAccessActivationDialog;

  const flow = useGoogleAuthFlow({
    application: "LMS",
    onLmsAccessNotActivated: handleLmsNotActivated,
  });

  return (
    <>
      <GoogleIdentityControl
        buttonRef={flow.buttonRef}
        stage={flow.stage}
        errorMessage={flow.errorMessage}
        retryAfter={flow.retryAfter}
        isBusy={flow.isBusy}
        saleRegistrationUrl={flow.saleRegistrationUrl}
        onRetry={flow.start}
      />
      <Dialog open={flow.stage === "link"} onOpenChange={(open) => { if (!open) flow.cancel(); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-nunito text-xl font-extrabold text-foreground">Liên kết tài khoản BeeWise</DialogTitle>
          </DialogHeader>
          {flow.stage === "link" && (
            <GoogleLinkForm
              email={flow.hints?.email}
              error={flow.error}
              pending={flow.isLinkPending}
              passwordRecoveryUrl="/forgot-password"
              onSubmit={flow.linkAccount}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
