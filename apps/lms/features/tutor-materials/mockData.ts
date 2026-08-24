import type {
  AIAnalyzeResponse,
  Learner,
  LearningSession,
  Lesson,
  TutorMaterial,
} from "./types";

export const MOCK_LEARNERS: Learner[] = [
  { id: "learner-minh-anh", fullName: "Nguyễn Minh Anh", initials: "MA", gradeLevel: "Lớp 10", joinedAt: "2026-02-14T09:00:00+07:00" },
  { id: "learner-gia-huy", fullName: "Trần Gia Huy", initials: "GH", gradeLevel: "Lớp 11", joinedAt: "2026-01-08T09:00:00+07:00" },
  { id: "learner-khanh-linh", fullName: "Lê Khánh Linh", initials: "KL", gradeLevel: "Lớp 12", joinedAt: "2025-11-21T09:00:00+07:00" },
  { id: "learner-thao-my", fullName: "Võ Thảo My", initials: "TM", gradeLevel: "Lớp 10", joinedAt: "2026-04-03T09:00:00+07:00" },
];

export const MOCK_SESSIONS: LearningSession[] = [
  { id: "session-ma-01", learnerId: "learner-minh-anh", subject: "Toán", topic: "Hệ phương trình bậc nhất", taughtAt: "2026-08-21T18:00:00+07:00", durationMinutes: 90, completed: true },
  { id: "session-ma-02", learnerId: "learner-minh-anh", subject: "Vật lý", topic: "Chuyển động thẳng biến đổi đều", taughtAt: "2026-08-18T19:30:00+07:00", durationMinutes: 90, completed: true },
  { id: "session-ma-03", learnerId: "learner-minh-anh", subject: "Toán", topic: "Bất phương trình bậc hai", taughtAt: "2026-08-11T18:00:00+07:00", durationMinutes: 90, completed: true },
  { id: "session-gh-01", learnerId: "learner-gia-huy", subject: "Vật lý", topic: "Động lực học chất điểm", taughtAt: "2026-08-20T20:00:00+07:00", durationMinutes: 90, completed: true },
  { id: "session-gh-02", learnerId: "learner-gia-huy", subject: "Toán", topic: "Hàm số lượng giác", taughtAt: "2026-08-13T20:00:00+07:00", durationMinutes: 120, completed: true },
  { id: "session-kl-01", learnerId: "learner-khanh-linh", subject: "Hóa học", topic: "Este và lipid", taughtAt: "2026-08-19T17:30:00+07:00", durationMinutes: 120, completed: true },
  { id: "session-kl-02", learnerId: "learner-khanh-linh", subject: "Toán", topic: "Nguyên hàm và tích phân", taughtAt: "2026-08-12T17:30:00+07:00", durationMinutes: 120, completed: true },
  { id: "session-tm-01", learnerId: "learner-thao-my", subject: "Tiếng Anh", topic: "IELTS Speaking Part 2", taughtAt: "2026-08-17T20:00:00+07:00", durationMinutes: 60, completed: true },
  { id: "session-tm-02", learnerId: "learner-thao-my", subject: "Tiếng Anh", topic: "Writing Task 1 - Bar chart", taughtAt: "2026-08-10T20:00:00+07:00", durationMinutes: 90, completed: true },
];

export const MOCK_MATERIALS: TutorMaterial[] = [
  { id: "material-01", learnerId: "learner-minh-anh", sessionId: "session-ma-01", title: "Tóm tắt hệ phương trình bậc nhất", source: "ai", status: "draft", fileType: "BEEWISE", updatedAt: "2026-08-21T20:10:00+07:00" },
  { id: "material-02", learnerId: "learner-minh-anh", sessionId: "session-ma-02", title: "Bài tập chuyển động biến đổi đều", source: "upload", status: "published", fileType: "PDF", fileSize: "2,4 MB", updatedAt: "2026-08-19T08:45:00+07:00" },
  { id: "material-03", learnerId: "learner-gia-huy", sessionId: "session-gh-01", title: "Sơ đồ lực và định luật Newton", source: "ai", status: "published", fileType: "BEEWISE", updatedAt: "2026-08-20T22:15:00+07:00" },
  { id: "material-04", learnerId: "learner-khanh-linh", sessionId: "session-kl-01", title: "Chuyên đề Este và lipid", source: "upload", status: "hidden", fileType: "PPTX", fileSize: "5,1 MB", updatedAt: "2026-08-20T09:30:00+07:00" },
  { id: "material-05", learnerId: "learner-khanh-linh", sessionId: "session-kl-02", title: "Bộ câu hỏi nguyên hàm cơ bản", source: "ai", status: "draft", fileType: "BEEWISE", updatedAt: "2026-08-13T10:40:00+07:00" },
  { id: "material-06", learnerId: "learner-thao-my", sessionId: "session-tm-02", title: "IELTS Writing Task 1 templates", source: "upload", status: "published", fileType: "DOCX", fileSize: "840 KB", updatedAt: "2026-08-11T08:20:00+07:00" },
];

export const MOCK_LESSONS: Lesson[] = MOCK_SESSIONS.map((session) => ({
  id: session.id,
  studentName: MOCK_LEARNERS.find((learner) => learner.id === session.learnerId)?.fullName ?? "Học viên",
  subject: `${session.subject} - ${session.topic}`,
  date: new Intl.DateTimeFormat("vi-VN").format(new Date(session.taughtAt)),
  status: MOCK_MATERIALS.some((material) => material.sessionId === session.id) ? "Drafting" : "Not Generated",
}));

export const MOCK_AI_RESPONSE: AIAnalyzeResponse = {
  summary: {
    title: "Hệ phương trình bậc nhất hai ẩn",
    overview: "Bài học giúp học viên hiểu hệ phương trình bậc nhất hai ẩn và các phương pháp giải cơ bản.",
    key_concepts: [
      {
        name: "Dạng tổng quát",
        explanation: "Hệ hai phương trình bậc nhất hai ẩn x và y có dạng tổng quát:",
        formulas: [{ latex: "\\begin{cases}a_1x+b_1y=c_1\\\\a_2x+b_2y=c_2\\end{cases}", description: "Các hệ số a và b không đồng thời bằng 0." }],
      },
      { name: "Phương pháp thế", explanation: "Rút một ẩn rồi thế vào phương trình còn lại.", formulas: [] },
    ],
    prerequisites: ["Phương trình bậc nhất một ẩn", "Biến đổi đại số cơ bản"],
  },
  quiz: {
    multiple_choice: [
      {
        question: "Hệ phương trình $\\begin{cases}x+y=3\\\\2x-y=3\\end{cases}$ có nghiệm là:",
        options: [
          { label: "A", content: "$(1, 2)$" },
          { label: "B", content: "$(2, 1)$" },
          { label: "C", content: "$(3, 0)$" },
          { label: "D", content: "$(0, 3)$" },
        ],
        correct_answer: "B",
        explanation: "Cộng hai phương trình được $3x=6$, suy ra $x=2$ và $y=1$.",
        difficulty: "easy",
      },
    ],
    exercises: [
      {
        problem: "Giải hệ phương trình bằng phương pháp thế.",
        solution_steps: [
          { step_number: 1, description: "Rút x theo y từ phương trình thứ hai." },
          { step_number: 2, description: "Thế biểu thức vào phương trình thứ nhất." },
        ],
        final_answer: "Nghiệm của hệ là $(2, 1)$.",
        difficulty: "medium",
      },
    ],
  },
};
