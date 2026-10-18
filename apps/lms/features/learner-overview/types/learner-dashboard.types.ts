export interface LearningCourse {
  id: string;
  title: string;
  subject: string;
  tutor: string;
  initials: string;
  completed: number;
  total: number;
  schedule: string;
  tone: "primary" | "accent" | "secondary";
}
export interface LearningAssignment {
  id: string;
  title: string;
  courseId: string;
  due: string;
  status: "pending" | "submitted" | "reviewed";
  score?: number;
  description: string;
}
export interface LearningSession {
  id: string;
  courseId: string;
  date: string;
  start: string;
  end: string;
  topic: string;
  mode: string;
}
export interface DashboardDetail {
  title: string;
  label: string;
  description: string;
  facts: { label: string; value: string }[];
}
export interface LearnerDashboardData {
  student: { name: string; initials: string; level: string; goal: string; joined: string };
  referenceDate: string;
  week: { date: string; day: string; number: string }[];
  courses: LearningCourse[];
  assignments: LearningAssignment[];
  sessions: LearningSession[];
  todos: { id: string; title: string; done: boolean }[];
  feedback: { tutor: string; subject: string; content: string; date: string };
  summary: { completed: number; total: number; pending: number; reviewed: number; average: number | null };
}