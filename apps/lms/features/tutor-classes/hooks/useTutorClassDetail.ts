"use client";

import { useMemo } from "react";
import { CLASS_ROSTER, TUTOR_CLASSES } from "../data/classes.mock";

export function useTutorClassDetail(classId: string) {
  return useMemo(() => {
    const classInfo = TUTOR_CLASSES.find((item) => item.id === classId);
    const learners = CLASS_ROSTER.filter((learner) => classInfo?.learnerIds.includes(learner.id));
    return { classInfo, learners };
  }, [classId]);
}
