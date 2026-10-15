import type { LmsClassQuery } from "./schemas/lms-class.schema";

// Actor is part of every key: never reuse another Tutor's class cache on login.
export const tutorClassQueryKeys = {
  all: ["tutor-classes"] as const,
  actor: (actorId: string) => [...tutorClassQueryKeys.all, actorId] as const,
  lists: (actorId: string) => [...tutorClassQueryKeys.actor(actorId), "list"] as const,
  list: (actorId: string, query: LmsClassQuery) => [...tutorClassQueryKeys.lists(actorId), query] as const,
  detail: (actorId: string, classId: string) => [...tutorClassQueryKeys.actor(actorId), "detail", classId] as const,
};
