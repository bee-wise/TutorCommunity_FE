"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassActor,
  useLmsClassResource,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import {
  clearGroupDraftResume,
  isGroupClassEditable,
  parseGroupDraftResume,
  readGroupDraftResumeRaw,
  subscribeGroupDraftResume,
} from "../utils/group-class-draft";

// The unsubmitted draft the tutor left mid-wizard, re-validated against the
// API so a class submitted or removed elsewhere stops being offered.
export function useGroupDraftResume() {
  const actor = useLmsClassActor();
  const raw = useSyncExternalStore(
    subscribeGroupDraftResume,
    () => readGroupDraftResumeRaw(actor.id),
    () => null,
  );
  const resume = useMemo(() => parseGroupDraftResume(raw), [raw]);
  const classId = resume?.classId ?? "";
  const query = useLmsClassResource(classId, "group", (s) => service.get(classId, s), {
    enabled: Boolean(resume),
  });
  const status = query.error ? handleApiError(query.error).statusCode : null;
  const stale =
    Boolean(resume) && ((query.data && !isGroupClassEditable(query.data)) || status === 403 || status === 404);
  useEffect(() => {
    if (stale) clearGroupDraftResume(actor.id, classId);
  }, [stale, actor.id, classId]);
  return {
    resume: resume && query.data && !stale ? { ...resume, data: query.data } : null,
    dismiss: () => clearGroupDraftResume(actor.id, classId),
  };
}
