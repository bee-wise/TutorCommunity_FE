"use client";

import { useMemo, useState } from "react";
import {
  LEARNER_EXERCISES,
  LEARNER_EXERCISE_CLASSES,
  LEARNER_EXERCISE_SESSIONS,
} from "../data/learner-exercises.mock";
import type {
  ExerciseAvailabilityFilter,
  ExerciseSource,
  ExerciseStatusFilter,
  LearnerExerciseClassSummary,
} from "../types/learner-exercises.types";

const PENDING_STATUSES = new Set(["not_started", "in_progress"]);

export function useExerciseClasses() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  const classes = useMemo<LearnerExerciseClassSummary[]>(() => LEARNER_EXERCISE_CLASSES.map((classInfo) => {
    const classExercises = LEARNER_EXERCISES.filter((exercise) => exercise.classId === classInfo.id);
    return {
      classInfo,
      sessionCount: LEARNER_EXERCISE_SESSIONS.filter((session) => session.classId === classInfo.id).length,
      exerciseCount: classExercises.length,
      pendingExerciseCount: classExercises.filter((exercise) => PENDING_STATUSES.has(exercise.status)).length,
    };
  }), []);
  const subjects = useMemo(() => [...new Set(LEARNER_EXERCISE_CLASSES.map((item) => item.subject))], []);
  const filteredClasses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return classes.filter(({ classInfo }) => {
      const content = `${classInfo.classCode} ${classInfo.name} ${classInfo.subject} ${classInfo.level} ${classInfo.tutorName}`.toLocaleLowerCase("vi");
      return content.includes(query) && (subject === "all" || classInfo.subject === subject);
    });
  }, [classes, search, subject]);

  return { search, subject, subjects, filteredClasses, setSearch, setSubject };
}

export function useExerciseSessions(classId: string) {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<ExerciseAvailabilityFilter>("all");
  const classInfo = LEARNER_EXERCISE_CLASSES.find((item) => item.id === classId);
  const sessions = useMemo(() => LEARNER_EXERCISE_SESSIONS.filter((session) => session.classId === classId), [classId]);
  const filteredSessions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return sessions.filter((session) => {
      const exerciseCount = LEARNER_EXERCISES.filter((exercise) => exercise.sessionId === session.id).length;
      const matchesAvailability = availability === "all"
        || (availability === "with_exercises" && exerciseCount > 0)
        || (availability === "without_exercises" && exerciseCount === 0);
      return session.topic.toLocaleLowerCase("vi").includes(query) && matchesAvailability;
    });
  }, [availability, search, sessions]);

  return { classInfo, search, availability, filteredSessions, setSearch, setAvailability };
}

export function useSessionExercises(classId: string, sessionId: string) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ExerciseStatusFilter>("all");
  const [source, setSource] = useState<"all" | ExerciseSource>("all");
  const classInfo = LEARNER_EXERCISE_CLASSES.find((item) => item.id === classId);
  const session = LEARNER_EXERCISE_SESSIONS.find((item) => item.id === sessionId && item.classId === classId);
  const filteredExercises = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return LEARNER_EXERCISES.filter((exercise) => {
      const content = `${exercise.title} ${exercise.description} ${exercise.lessonTopic}`.toLocaleLowerCase("vi");
      return exercise.classId === classId
        && exercise.sessionId === sessionId
        && content.includes(query)
        && (status === "all" || exercise.status === status)
        && (source === "all" || exercise.source === source);
    });
  }, [classId, search, sessionId, source, status]);

  return { classInfo, session, search, status, source, filteredExercises, setSearch, setStatus, setSource };
}
