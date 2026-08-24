export const queryKeys = {
  authKey: {
    getMe: "me",
  },
  favoriteTutors: {
    all: ["favorite-tutors"] as const,
    ids: ["favorite-tutors", "ids"] as const,
    list: (params?: { page?: number; pageSize?: number }) =>
      ["favorite-tutors", "list", params] as const,
  },
};
