import {
  MOCK_LEARNERS,
  MOCK_SESSIONS,
  MOCK_MATERIALS,
  MOCK_AI_RESPONSE,
} from "../mockData";
import type {
  MaterialClass,
  ClassSession,
  ClassMaterial,
} from "../types/class-materials.types";

export const MATERIAL_CLASSES: MaterialClass[] = [
  {
    id: "class-ma-math",
    code: "BW-101",
    title: "Toán 10 cùng Minh Anh",
    subject: "Toán",
    level: "Lớp 10",
    kind: "individual",
    status: "active",
    createdAt: "2026-08-14",
    learnerIds: ["learner-minh-anh"],
  },
  {
    id: "class-ma-physics",
    code: "BW-102",
    title: "Vật lý 10 cùng Minh Anh",
    subject: "Vật lý",
    level: "Lớp 10",
    kind: "individual",
    status: "active",
    createdAt: "2026-08-02",
    learnerIds: ["learner-minh-anh"],
  },
  {
    id: "class-gh-physics",
    code: "BW-103",
    title: "Vật lý 11 cùng Gia Huy",
    subject: "Vật lý",
    level: "Lớp 11",
    kind: "individual",
    status: "active",
    createdAt: "2026-07-12",
    learnerIds: ["learner-gia-huy"],
  },
  {
    id: "class-gh-math",
    code: "BW-104",
    title: "Toán 11 cùng Gia Huy",
    subject: "Toán",
    level: "Lớp 11",
    kind: "individual",
    status: "completed",
    createdAt: "2026-02-08",
    learnerIds: ["learner-gia-huy"],
  },
  {
    id: "class-kl-chemistry",
    code: "BW-105",
    title: "Hóa 12 cùng Khánh Linh",
    subject: "Hóa học",
    level: "Lớp 12",
    kind: "individual",
    status: "active",
    createdAt: "2026-06-21",
    learnerIds: ["learner-khanh-linh"],
  },
  {
    id: "class-kl-math",
    code: "BW-106",
    title: "Toán 12 cùng Khánh Linh",
    subject: "Toán",
    level: "Lớp 12",
    kind: "individual",
    status: "completed",
    createdAt: "2026-03-11",
    learnerIds: ["learner-khanh-linh"],
  },
  {
    id: "class-tm-english",
    code: "BW-107",
    title: "IELTS cùng Thảo My",
    subject: "Tiếng Anh",
    level: "IELTS",
    kind: "individual",
    status: "active",
    createdAt: "2026-08-05",
    learnerIds: ["learner-thao-my"],
  },
  {
    id: "class-group-math",
    code: "BW-G201",
    title: "Toán 10: nền tảng vững vàng",
    subject: "Toán",
    level: "Lớp 10",
    kind: "group",
    status: "active",
    createdAt: "2026-08-19",
    learnerIds: ["learner-minh-anh", "learner-thao-my", "learner-gia-huy"],
  },
  {
    id: "class-group-english",
    code: "BW-G202",
    title: "IELTS Speaking: cùng nhau luyện nói",
    subject: "Tiếng Anh",
    level: "IELTS",
    kind: "group",
    status: "upcoming",
    createdAt: "2026-08-22",
    learnerIds: ["learner-thao-my", "learner-khanh-linh"],
  },
  {
    id: "class-group-review",
    code: "BW-G203",
    title: "Ôn tập Toán hè",
    subject: "Toán",
    level: "Lớp 11",
    kind: "group",
    status: "completed",
    createdAt: "2026-05-15",
    learnerIds: ["learner-minh-anh", "learner-gia-huy"],
  },
];

export const CLASS_LEARNERS = MOCK_LEARNERS;
export const CLASS_SESSIONS: ClassSession[] = [
  ...MOCK_SESSIONS.flatMap((session) => {
    const classInfo = MATERIAL_CLASSES.find(
      (item) =>
        item.kind === "individual" &&
        item.subject === session.subject &&
        item.learnerIds.includes(session.learnerId),
    );
    return classInfo
      ? [
          {
            ...session,
            classId: classInfo.id,
            zoomTranscript:
              session.id === "session-ma-01"
                ? "Gia sư: Hôm nay chúng ta học hệ phương trình bậc nhất hai ẩn. Với x + y = 3 và 2x - y = 3, cộng hai phương trình để được 3x = 6, suy ra x = 2 và y = 1. Có hai phương pháp chính: phương pháp thế và phương pháp cộng đại số. Học viên: Em cần thay nghiệm vào cả hai phương trình để kiểm tra. Gia sư: Chính xác. Bài tập về nhà là giải ba hệ phương trình và trình bày từng bước."
                : undefined,
          },
        ]
      : [];
  }),
  {
    id: "session-group-math-01",
    classId: "class-group-math",
    topic: "Hệ phương trình bậc nhất",
    taughtAt: "2026-08-21T18:00:00+07:00",
    durationMinutes: 90,
    completed: true,
    zoomTranscript:
      "Gia sư: Hệ phương trình gồm x + y = 3 và 2x - y = 3. Minh Anh: Cộng hai phương trình ta có 3x = 6. Gia Huy: Vậy x = 2, thay vào phương trình thứ nhất được y = 1. Thảo My: Em kiểm tra lại cả hai phương trình. Gia sư: Cả lớp hãy luyện tập phương pháp thế và cộng đại số, lưu ý dấu khi biến đổi.",
  },
  {
    id: "session-group-math-02",
    classId: "class-group-math",
    topic: "Bất phương trình bậc hai",
    taughtAt: "2026-08-28T18:00:00+07:00",
    durationMinutes: 90,
    completed: false,
  },
  {
    id: "session-group-review-01",
    classId: "class-group-review",
    topic: "Tổng kết kiến thức Toán hè",
    taughtAt: "2026-07-30T18:00:00+07:00",
    durationMinutes: 90,
    completed: true,
  },
];

export const CLASS_MATERIALS: ClassMaterial[] = MOCK_MATERIALS.flatMap(
  (material) => {
    const session = CLASS_SESSIONS.find(
      (item) => item.id === material.sessionId,
    );
    return session
      ? [
          {
            ...material,
            classId: session.classId,
            data: material.source === "ai" ? MOCK_AI_RESPONSE : undefined,
          },
        ]
      : [];
  },
);
