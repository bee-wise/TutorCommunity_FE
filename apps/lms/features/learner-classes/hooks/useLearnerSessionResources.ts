"use client";
import { useState } from "react";
import {
  attendanceSchema,
  recordingSchema,
} from "@workspace/core/lms-classes/schemas";
import {
  getLmsResource,
  sessionPath,
} from "@workspace/core/lms-classes/api-response";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { learnerClassesService } from "../services/learner-classes.service";

export function useLearnerSessionResources(
  classId: string,
  sessionId: string,
  group: boolean,
  attendanceEnabled: boolean,
) {
  const session = useLmsClassResource(
    classId,
    "learner-session",
    (s) => learnerClassesService.session(classId, sessionId, s),
    { roles: ["LEARNER"], params: [sessionId] },
  );
  const [attempt, setAttempt] = useState("");
  const attendance = useLmsClassResource(
    classId,
    "learner-personal-attendance",
    (s) =>
      getLmsResource(
        `${sessionPath(sessionId)}/attendance`,
        attendanceSchema.refine((v) => v.sessionId === sessionId),
        s,
      ),
    {
      roles: ["LEARNER"],
      params: [sessionId],
      enabled:
        Boolean(session.data) &&
        group &&
        attendanceEnabled &&
        ["ONGOING", "COMPLETED"].includes(session.data?.status ?? ""),
    },
  );
  const playback = useLmsClassResource(
    classId,
    "learner-playback",
    (s) =>
      getLmsResource(
        `${sessionPath(sessionId)}/recording/playback`,
        recordingSchema.refine((v) => v.sessionId === sessionId),
        s,
      ),
    {
      roles: ["LEARNER"],
      params: [sessionId, attempt],
      enabled:
        Boolean(attempt) &&
        Boolean(session.data) &&
        group &&
        session.data?.status === "COMPLETED",
    },
  );
  return {
    session,
    attendance,
    playback,
    attempt,
    mark: attendance.data?.marks.find(
      (m) => m.learnerId === attendance.actor.id,
    ),
    url:
      !playback.isFetching && playback.data?.visibility === "PUBLIC"
        ? safeExternalUrl(playback.data.url)
        : null,
    checkPlayback: () => setAttempt(crypto.randomUUID()),
  };
}
