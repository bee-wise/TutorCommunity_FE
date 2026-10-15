import { z } from "zod";
import {
  classPath,
  sessionPath,
  getLmsResource,
  postLmsCommand,
  putLmsCommand,
  nullableList,
} from "./api-response";
import {
  sessionSchema,
  sessionPageSchema,
  plannedSchema,
  createPlannedSchema,
  slotSchema,
  batchSchema,
  previewSchema,
  scheduleResultSchema,
  versionCommand,
  rosterSchema,
  attendanceSchema,
  attendanceCommandSchema,
  historySchema,
  recordingSchema,
  recordingCommandSchema,
} from "./schemas";

export const classSessionsService = {
  list: (id: string, page: number, status?: string, signal?: AbortSignal) =>
    getLmsResource(`${classPath(id)}/sessions`, sessionPageSchema, signal, {
      page,
      pageSize: 6,
      status,
    }),
  detail: (classId: string, id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(classId)}/sessions/${id}`,
      sessionSchema,
      signal,
    ),
  planned: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(id)}/planned-schedules`,
      nullableList(plannedSchema),
      signal,
    ),
  createPlanned: (id: string, input: z.infer<typeof createPlannedSchema>) =>
    postLmsCommand(
      `${classPath(id)}/planned-schedules`,
      plannedSchema,
      createPlannedSchema.parse(input),
    ),
  preview: (id: string, slots: z.infer<typeof slotSchema>[]) =>
    postLmsCommand(`/classes/${id}/sessions/preview`, previewSchema, {
      sessions: z.array(slotSchema).min(1).parse(slots),
    }),
  createBatch: (id: string, input: z.infer<typeof batchSchema>) =>
    postLmsCommand(
      `/classes/${id}/sessions`,
      scheduleResultSchema,
      batchSchema.parse(input),
    ),
  start: (id: string, version: number) =>
    postLmsCommand(
      `${sessionPath(id)}/start`,
      sessionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  complete: (id: string) =>
    postLmsCommand(`${sessionPath(id)}/complete`, sessionSchema),
  cancel: (id: string, version: number) =>
    postLmsCommand(
      `${sessionPath(id)}/cancel`,
      sessionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  reschedule: (id: string, input: z.infer<typeof slotSchema>) =>
    postLmsCommand(`${sessionPath(id)}/reschedule`, scheduleResultSchema, {
      session: slotSchema.parse(input),
    }),
  roster: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${sessionPath(id)}/roster`,
      nullableList(rosterSchema),
      signal,
    ),
  attendance: (id: string, signal?: AbortSignal) =>
    getLmsResource(`${sessionPath(id)}/attendance`, attendanceSchema, signal),
  history: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${sessionPath(id)}/attendance/history`,
      nullableList(historySchema),
      signal,
    ),
  saveAttendance: (
    id: string,
    input: z.infer<typeof attendanceCommandSchema>,
  ) =>
    putLmsCommand(
      `${sessionPath(id)}/attendance`,
      attendanceSchema,
      attendanceCommandSchema.parse(input),
    ),
  recording: (id: string, signal?: AbortSignal) =>
    getLmsResource(`${sessionPath(id)}/recording`, recordingSchema, signal),
  playback: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${sessionPath(id)}/recording/playback`,
      recordingSchema,
      signal,
    ),
  saveRecording: (id: string, input: z.infer<typeof recordingCommandSchema>) =>
    putLmsCommand(
      `${sessionPath(id)}/recording`,
      recordingSchema,
      recordingCommandSchema.parse(input),
    ),
};
