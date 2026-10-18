import { InterviewPolicy } from "./InterviewPolicy";
import { InterviewDeviceCheck } from "./InterviewDeviceCheck";
import type { InterviewController } from "./InterviewUi";

export function InterviewSetup({ interview }: { interview: InterviewController }) {
  if (interview.phase === "policy") return <InterviewPolicy interview={interview} />;
  return <InterviewDeviceCheck interview={interview} />;
}
