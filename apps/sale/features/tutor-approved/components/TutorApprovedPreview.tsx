"use client";

import { useRouter } from "next/navigation";
import { TutorApprovedProvider } from "./TutorApprovedProvider";
import { TutorApprovedScreenView, TutorApprovedShell } from "./tutor-approved.ui";
import { parseTutorApprovedScenario } from "../schemas/tutor-approved.resolver";
import { tutorApprovedScenarios, type TutorApprovedScenario, type TutorApprovedScreen } from "../types";

const previewUser = {
  id: "preview-approved-tutor",
  email: "minh.anh@beewise.test",
  firstName: "Minh Anh",
  lastName: "Nguyễn",
  fullName: "Nguyễn Minh Anh",
  phoneNumber: "0900000000",
  role: "TUTOR",
  status: "APPROVED",
  permissions: [],
  tutorProfileStatus: "COMPLETED",
  canAccessTutorLms: true,
  unreadNotificationCount: 4,
  unreadChatCount: 3,
};

function scenarioScreen(scenario: TutorApprovedScenario): TutorApprovedScreen {
  if (scenario === "profile-edit") return "profile-edit";
  if (scenario === "notifications") return "notifications";
  if (scenario === "subscription-renewal") return "subscription";
  return "home";
}

export function TutorApprovedPreview({ scenario, capture }: { scenario?: string | null; capture: boolean }) {
  const parsed = parseTutorApprovedScenario(scenario);
  const screen = scenarioScreen(parsed);
  const router = useRouter();
  const navigate = (next: TutorApprovedScenario, nextCapture = capture) => {
    const params = new URLSearchParams({ scenario: next });
    if (nextCapture) params.set("capture", "1");
    router.push(`/dev/tutor-approved?${params.toString()}`);
  };
  return (
    <TutorApprovedProvider scenario={parsed}>
      <TutorApprovedShell
        screen={screen}
        previewUser={previewUser}
        capture={capture}
        toolbar={!capture ? <div className="fixed left-1/2 top-18 z-90 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border bg-white/95 px-3 py-2 shadow-lg backdrop-blur"><span className="text-xs font-bold text-[#905b0f]">PREVIEW</span><label className="sr-only" htmlFor="approved-scenario">Scenario</label><select id="approved-scenario" value={parsed} onChange={(e)=>navigate(e.target.value as TutorApprovedScenario,false)} className="rounded-full border px-3 py-1 text-xs">{tutorApprovedScenarios.map((item: string)=><option key={item}>{item}</option>)}</select><button onClick={()=>navigate(parsed,true)} className="text-xs font-bold text-[#280f91]">Capture mode</button></div> : null}
      >
        <TutorApprovedScreenView screen={screen} />
      </TutorApprovedShell>
    </TutorApprovedProvider>
  );
}
