"use client";

import { useGoogleAuthFlow } from "@workspace/core/hooks/useGoogleAuthFlow";
import { GoogleIdentityControl } from "@workspace/ui/components/auth/GoogleIdentityControl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { GoogleRegistrationForm } from "./GoogleRegistrationForm";
import { GoogleLinkForm } from "./GoogleLinkForm";

export function GoogleAuthEntry({
  returnUrl,
  mode,
}: {
  returnUrl?: string | null;
  mode: "login" | "register";
}) {
  const flow = useGoogleAuthFlow({
    application: "SALE",
    returnUrl,
    context: mode === "register" ? "signup_with" : "signin_with",
  });
  const continuationOpen = flow.stage === "register" || flow.stage === "link";

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
      <Dialog open={continuationOpen} onOpenChange={(open) => { if (!open) flow.cancel(); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-nunito text-xl font-extrabold text-foreground">
              {flow.stage === "register" ? "Hoàn tất đăng ký" : "Liên kết tài khoản BeeWise"}
            </DialogTitle>
          </DialogHeader>
          {flow.stage === "register" ? (
            <GoogleRegistrationForm
              email={flow.hints?.email}
              firstName={flow.hints?.firstName}
              lastName={flow.hints?.lastName}
              error={flow.error}
              pending={flow.isRegisterPending}
              onSubmit={flow.registerAccount}
            />
          ) : flow.stage === "link" ? (
            <GoogleLinkForm
              email={flow.hints?.email}
              error={flow.error}
              pending={flow.isLinkPending}
              onSubmit={flow.linkAccount}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
