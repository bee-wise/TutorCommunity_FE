import { CLASS_ROSTER, TUTOR_CLASSES } from "../../tutor-classes/data/classes.mock";
import { classChatMessageSchema, type ClassChatMessageInput } from "../schemas/class-chat.schema";
import type { ClassChatMessage, ClassChatParticipant, ClassChatRoom } from "../types/class-chat.types";

// UI-only adapter. No connection room IDs, production API calls or realtime claims.
// Keeps demo messages in this tab's module memory; reload clears all sent messages.
const messagesByClass = new Map<string, ClassChatMessage[]>();
const DEMO_TUTOR: ClassChatParticipant = { id: "class-demo-tutor", fullName: "Gia sư", initials: "GS", role: "TUTOR" };

function requireClass(classId: string) {
  const classInfo = TUTOR_CLASSES.find((item) => item.id === classId);
  if (!classInfo) throw new Error("Không tìm thấy lớp học.");
  return classInfo;
}

function getMessages(classId: string): ClassChatMessage[] {
  const classInfo = requireClass(classId);
  const existing = messagesByClass.get(classId);
  if (existing) return existing;
  const learners = CLASS_ROSTER.filter((learner) => classInfo.learnerIds.includes(learner.id));
  const seeded: ClassChatMessage[] = [{ id: `${classId}-welcome`, classId, senderId: DEMO_TUTOR.id,
    senderName: DEMO_TUTOR.fullName, senderRole: "TUTOR", createdAt: classInfo.createdAt,
    content: "Chào cả lớp! Mình trao đổi nội dung học tập và câu hỏi sau buổi học tại đây nhé." },
  ...learners.slice(0, 2).map((learner, index): ClassChatMessage => ({ id: `${classId}-${learner.id}-hello`,
    classId, senderId: learner.id, senderName: learner.fullName, senderRole: "LEARNER",
    content: index === 0 ? "Em chào thầy/cô. Em sẽ gửi các câu hỏi khi ôn bài ở đây ạ." : "Em chào cả lớp, mình cùng trao đổi bài học nhé!",
    createdAt: new Date(new Date(classInfo.createdAt).getTime() + (index + 1) * 60_000).toISOString() }))];
  messagesByClass.set(classId, seeded);
  return seeded;
}

export function getMockClassChatRoom(classId: string): ClassChatRoom {
  const classInfo = requireClass(classId);
  return { classId, readOnly: classInfo.status === "completed",
    participants: [{ ...DEMO_TUTOR }, ...CLASS_ROSTER.filter((learner) => classInfo.learnerIds.includes(learner.id))
      .map((learner): ClassChatParticipant => ({ id: learner.id, fullName: learner.fullName, initials: learner.initials, role: "LEARNER" }))],
    messages: getMessages(classId).map((message) => ({ ...message })) };
}

export function sendMockClassMessage(classId: string, input: ClassChatMessageInput): ClassChatMessage {
  const classInfo = requireClass(classId);
  if (classInfo.status === "completed") throw new Error("Lớp đã kết thúc. Bạn chỉ có thể xem lại tin nhắn.");
  const { content } = classChatMessageSchema.parse(input);
  const messages = getMessages(classId);
  const message: ClassChatMessage = { id: `${classId}-sent-${messages.length + 1}`, classId,
    senderId: DEMO_TUTOR.id, senderName: DEMO_TUTOR.fullName, senderRole: "TUTOR",
    content, createdAt: new Date().toISOString() };
  messagesByClass.set(classId, [...messages, message]);
  return { ...message };
}

export const classChatMockService = {
  async getRoom(classId: string) { return getMockClassChatRoom(classId); },
  async sendMessage(classId: string, input: ClassChatMessageInput) { return sendMockClassMessage(classId, input); },
};
