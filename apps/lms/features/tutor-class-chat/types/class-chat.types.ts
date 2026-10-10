export interface ClassChatParticipant {
  id: string; fullName: string; initials: string; role: "TUTOR" | "LEARNER";
}
export interface ClassChatMessage {
  id: string; classId: string; senderId: string; senderName: string;
  senderRole: "TUTOR" | "LEARNER"; content: string; createdAt: string;
}
export interface ClassChatRoom {
  classId: string; readOnly: boolean; participants: readonly ClassChatParticipant[];
  messages: readonly ClassChatMessage[];
}
