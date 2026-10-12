import { InterviewPolicy } from "./InterviewPolicy";
import { InterviewDeviceCheck } from "./InterviewDeviceCheck";
import { InterviewReady } from "./InterviewReady";
import type { InterviewController } from "./InterviewUi";

export function InterviewSetup({ interview }: { interview: InterviewController }) {
  if (interview.phase === "policy") return <InterviewPolicy interview={interview} />;
  if (interview.phase === "ready") return <InterviewReady interview={interview} />;
  return <InterviewDeviceCheck interview={interview} />;
}
