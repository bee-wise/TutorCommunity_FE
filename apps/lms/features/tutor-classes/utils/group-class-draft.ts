import { z } from "zod";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";

export const groupWizardSteps = [
  "Nội dung giảng dạy",
  "Thông tin lớp",
  "Lịch & học phí",
  "Lộ trình",
  "Gửi duyệt",
] as const;
export const GROUP_WIZARD_ROADMAP_STEP = 3;
export const GROUP_WIZARD_SUBMIT_STEP = 4;

const editableApprovals = ["DRAFT", "REJECTED", "CHANGES_REQUESTED", "REQUEST_CHANGES"];

// Tutor may edit info/roadmap and (re)submit only before review succeeds.
export function isGroupClassEditable(data: GroupDto) {
  return (
    data.status === "UPCOMING" &&
    ["ONLINE", "OFFLINE"].includes(data.teachingMode ?? "") &&
    ["MONTHLY", "FULL_COURSE"].includes(data.billingMode ?? "") &&
    editableApprovals.includes(data.approvalStatus ?? "")
  );
}

// Remembers the last unsubmitted draft so the classes screen can offer to
// resume the wizard. Only the class id and step are stored; class data is
// always re-read from the API.
const resumeSchema = z.object({
  classId: z.guid(),
  step: z.number().int().min(0).max(GROUP_WIZARD_SUBMIT_STEP),
});
export type GroupDraftResume = z.infer<typeof resumeSchema>;

const storageKey = (actorId: string) => `beewise:lms:group-class-draft:${actorId}`;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export function subscribeGroupDraftResume(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
export function readGroupDraftResumeRaw(actorId: string) {
  try {
    return actorId ? localStorage.getItem(storageKey(actorId)) : null;
  } catch {
    return null;
  }
}
export function parseGroupDraftResume(raw: string | null): GroupDraftResume | null {
  if (!raw) return null;
  try {
    const parsed = resumeSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
export function writeGroupDraftResume(actorId: string, value: GroupDraftResume) {
  try {
    localStorage.setItem(storageKey(actorId), JSON.stringify(value));
  } catch {
    return;
  }
  notify();
}
export function clearGroupDraftResume(actorId: string, classId?: string) {
  const current = parseGroupDraftResume(readGroupDraftResumeRaw(actorId));
  if (classId && current?.classId !== classId) return;
  try {
    localStorage.removeItem(storageKey(actorId));
  } catch {
    return;
  }
  notify();
}
