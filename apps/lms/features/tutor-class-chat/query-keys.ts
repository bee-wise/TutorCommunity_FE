export const classChatQueryKeys = {
  all: ["tutor-class-chat-mock"] as const,
  room: (classId: string) => ["tutor-class-chat-mock", "room", classId] as const,
};
