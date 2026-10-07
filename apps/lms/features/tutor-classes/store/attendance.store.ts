"use client";

import { create } from "zustand";
import type { AttendanceRevision, SessionAttendance } from "../types/classes.types";
import type { AttendanceCommand } from "../types/attendance.schemas";
import { saveMockAttendance } from "../services/attendance.service";

interface AttendanceStore {
  records: Record<string, SessionAttendance>;
  revisions: AttendanceRevision[];
  save: (command: AttendanceCommand) => SessionAttendance;
}

// Session-only demo store. Reload clears data; BE replaces this with durable storage.
export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: {}, revisions: [],
  save(command) {
    const previous = get().records[command.sessionId];
    const next = saveMockAttendance(command, previous);
    set((state) => ({ records: { ...state.records, [next.sessionId]: next },
      revisions: [...state.revisions, { previous: previous ? structuredClone(previous) : null, next: structuredClone(next) }] }));
    return next;
  },
}));
