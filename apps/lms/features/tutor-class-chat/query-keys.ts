import { lmsClassKeys } from "@workspace/core/lms-classes/query-keys";

export const classChatQueryKeys = {
  all: lmsClassKeys.all,
  room: (classId: string, actorId = "") =>
    lmsClassKeys.resource(actorId, classId, "chat"),
};
