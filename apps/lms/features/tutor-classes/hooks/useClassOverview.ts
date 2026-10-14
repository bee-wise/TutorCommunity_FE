"use client";

import { useTutorClassDetail } from "./useTutorClassDetail";

export function useClassOverview(classId: string) {
  return useTutorClassDetail(classId);
}
