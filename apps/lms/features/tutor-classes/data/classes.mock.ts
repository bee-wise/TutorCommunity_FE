import { MATERIAL_CLASSES, CLASS_LEARNERS, CLASS_SESSIONS } from "../../tutor-materials/data/classroom.mock";
import type { TutorClass, ClassLearner, TutorClassSession } from "../types/classes.types";

// Temporary adapter: use the exact class and learner identifiers from Materials.
// Replace this adapter with the BE read model described in README.md.
export const TUTOR_CLASSES: readonly TutorClass[] = MATERIAL_CLASSES;
// Reserved example addresses are demo data, never real learner contact details.
const DEMO_EMAILS: Readonly<Record<string, string>> = {
  "learner-minh-anh": "minh.anh@example.com",
  "learner-gia-huy": "gia.huy@example.com",
  "learner-khanh-linh": "khanh.linh@example.com",
  "learner-thao-my": "thao.my@example.com",
};
export const CLASS_ROSTER: readonly ClassLearner[] = CLASS_LEARNERS.map((learner) => ({
  ...learner, email: DEMO_EMAILS[learner.id] ?? null, avatarUrl: null,
}));
export const TUTOR_CLASS_SESSIONS: readonly TutorClassSession[] = [
  ...CLASS_SESSIONS.map((session): TutorClassSession => ({
    id: session.id, classId: session.classId, topic: session.topic,
    taughtAt: session.taughtAt, durationMinutes: session.durationMinutes,
    status: session.completed ? "completed" : "scheduled",
  })),
  // Additional explicit demo states; never infer lifecycle from the browser clock.
  { id: "demo-group-math-live", classId: "class-group-math", topic: "Luyện tập hệ phương trình", taughtAt: "2026-10-06T18:00:00+07:00", durationMinutes: 90, status: "ongoing" },
  { id: "demo-ma-math-cancelled", classId: "class-ma-math", topic: "Ôn tập phương trình", taughtAt: "2026-10-03T18:00:00+07:00", durationMinutes: 90, status: "cancelled" },
];
