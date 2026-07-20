"use client";

import { useTutorAuthGuard, useTutorPublicProfileRedirect } from "../hooks/useTutorAuthGuard";
import { TutorApprovedProvider } from "./TutorApprovedProvider";
import { resolveTutorApprovedScenario } from "../schemas/tutor-approved.resolver";
import { TutorApprovedScreenView, TutorApprovedShell } from "./tutor-approved.ui";
import type { TutorApprovedScreen } from "../types";

export function TutorApprovedRoute({ screen, chatRoomId }: { screen: TutorApprovedScreen; chatRoomId?: string }) {
  const { isAuthorized, user } = useTutorAuthGuard();

  if (!isAuthorized || !user) return null;
  
  return (
    <TutorApprovedProvider scenario={resolveTutorApprovedScenario(user)}>
      <TutorApprovedShell screen={screen}>
        <TutorApprovedScreenView screen={screen} chatRoomId={chatRoomId} />
      </TutorApprovedShell>
    </TutorApprovedProvider>
  );
}

export function TutorPublicProfileRedirect() {
  useTutorPublicProfileRedirect();
  return null;
}

