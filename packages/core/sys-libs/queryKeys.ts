export const queryKeys = {
  authKey: {
    getMe: "me",
  },
  connectRequests: {
    eligibility: (userId: string) => ["connect-requests", "eligibility", userId] as const,
    outbound: (userId: string) => ["connect-requests", "outbound", userId] as const,
  },
  saleChatRooms: {
    list: ["sale", "chat-rooms"] as const,
    room: (id: string) => ["sale", "chat-rooms", id] as const,
    messages: (id: string) => ["sale", "chat-rooms", id, "messages"] as const,
  },
  favoriteTutors: {
    all: ["favorite-tutors"] as const,
    ids: ["favorite-tutors", "ids"] as const,
    list: (params?: { page?: number; pageSize?: number }) =>
      ["favorite-tutors", "list", params] as const,
  },
};
