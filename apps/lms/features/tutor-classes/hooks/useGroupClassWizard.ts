"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  groupDraftSchema,
  roadmapCommandSchema,
  type GroupDraft,
  type GroupDto,
} from "@workspace/core/lms-classes/group.schemas";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassActor,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import {
  GROUP_WIZARD_ROADMAP_STEP,
  GROUP_WIZARD_SUBMIT_STEP,
  clearGroupDraftResume,
  writeGroupDraftResume,
} from "../utils/group-class-draft";

export type GroupRoadmapValues = z.infer<typeof roadmapCommandSchema>;
type Operation =
  | { kind: "draft"; draft: GroupDraft; version?: number }
  | { kind: "roadmap"; value: GroupRoadmapValues }
  | { kind: "submit"; version: number };

const draftFieldsByStep: (keyof GroupDraft)[][] = [
  ["teachingOfferingId"],
  ["title", "highlight", "description", "teachingMode", "location"],
  ["openingAt", "capacity", "billingMode", "sessionDurationMinutes", "numberOfSessions", "pricePerSession"],
];
const lastDraftStep = draftFieldsByStep.length - 1;

function draftDefaults(data?: GroupDto): GroupDraft {
  return {
    title: data?.title ?? "",
    description: data?.description ?? "",
    teachingOfferingId: data?.teachingOfferingId ?? "",
    teachingMode: data?.teachingMode === "OFFLINE" ? "OFFLINE" : "ONLINE",
    location: data?.location ?? "",
    openingAt: data?.openingAt ?? null,
    capacity: data?.capacity ?? 6,
    billingMode: data?.billingMode === "FULL_COURSE" ? "FULL_COURSE" : "MONTHLY",
    sessionDurationMinutes: data?.sessionDurationMinutes ?? 60,
    numberOfSessions: data?.numberOfSessions ?? 8,
    pricePerSession: data?.pricePerSession ?? 0,
    highlight: data?.highlight ?? "",
  };
}
const roadmapDefaults = (data?: GroupDto): GroupRoadmapValues => ({
  expectedVersion: data?.version ?? 0,
  stages: data?.roadmap ?? [],
});

export function useGroupClassWizard({
  initial,
  initialStep = 0,
  mode,
}: {
  initial?: GroupDto;
  initialStep?: number;
  mode: "create" | "edit";
}) {
  const actor = useLmsClassActor();
  const [id] = useState(() => initial?.id ?? crypto.randomUUID());
  const [saved, setSaved] = useState<GroupDto | undefined>(initial);
  const [step, setStep] = useState(initialStep);
  const [reached, setReached] = useState(mode === "edit" ? GROUP_WIZARD_SUBMIT_STEP : initialStep);
  const [error, setError] = useState<string | null>(null);
  const draftForm = useForm<GroupDraft>({
    resolver: zodResolver(groupDraftSchema),
    defaultValues: draftDefaults(initial),
  });
  const roadmapForm = useForm<GroupRoadmapValues>({
    resolver: zodResolver(roadmapCommandSchema),
    defaultValues: roadmapDefaults(initial),
  });
  const command = useLmsClassCommand(id, (op: Operation) => {
    if (op.kind === "draft")
      return op.version === undefined
        ? service.create({ id, draft: op.draft })
        : service.update(id, { expectedVersion: op.version, draft: op.draft });
    if (op.kind === "roadmap") return service.roadmap(id, op.value);
    return service.submit(id, op.version);
  });

  const remember = (nextStep: number) => {
    if (mode === "create") writeGroupDraftResume(actor.id, { classId: id, step: nextStep });
  };
  async function run(op: Operation) {
    setError(null);
    try {
      const result = await command.mutateAsync(op);
      setSaved(result);
      return result;
    } catch (cause) {
      const apiError = handleApiError(cause);
      if (apiError.statusCode === 409) {
        // Keep the tutor's input; only refresh the version for the retry.
        const latest = await service.get(id).catch(() => undefined);
        if (latest) setSaved(latest);
        setError("Lớp vừa được cập nhật ở nơi khác. Đã tải phiên bản mới nhất, kiểm tra lại rồi thử lại.");
      } else setError(apiError.message || "Chưa lưu được lớp. Vui lòng thử lại.");
      return null;
    }
  }
  async function saveDraft() {
    const draft = draftForm.getValues();
    const result = await run({ kind: "draft", draft: groupDraftSchema.parse(draft), version: saved?.version });
    if (result) draftForm.reset(draftDefaults(result));
    return result;
  }
  async function saveRoadmap(version: number) {
    const value = roadmapForm.getValues();
    const result = await run({
      kind: "roadmap",
      value: {
        expectedVersion: version,
        stages: value.stages.map((stage, i) => ({
          ...stage,
          order: i + 1,
          lessons: stage.lessons.map((lesson, j) => ({ ...lesson, order: j + 1 })),
        })),
      },
    });
    if (result) roadmapForm.reset(roadmapDefaults(result));
    return Boolean(result);
  }

  // Moving forward validates and persists every step being left behind, so
  // the server draft always matches what the tutor has confirmed.
  async function goTo(target: number) {
    if (command.isPending || target === step) return;
    if (target < step) return void setStep(target);
    for (let s = step; s < Math.min(target, lastDraftStep + 1); s++) {
      if (!(await draftForm.trigger(draftFieldsByStep[s]))) return void setStep(s);
    }
    // State updates land after this call, so track the newest version locally.
    let version = saved?.version;
    if (step <= lastDraftStep && target > lastDraftStep && (!saved || draftForm.formState.isDirty)) {
      const result = await saveDraft();
      if (!result) return;
      version = result.version;
    }
    if (step <= GROUP_WIZARD_ROADMAP_STEP && target > GROUP_WIZARD_ROADMAP_STEP && roadmapForm.formState.isDirty) {
      if (!(await roadmapForm.trigger())) return void setStep(GROUP_WIZARD_ROADMAP_STEP);
      if (version === undefined || !(await saveRoadmap(version))) return;
    }
    setStep(target);
    setReached((r) => Math.max(r, target));
    if (target > lastDraftStep) remember(target);
  }
  async function submitForReview() {
    if (!saved) return null;
    const result = await run({ kind: "submit", version: saved.version });
    if (result) clearGroupDraftResume(actor.id, id);
    return result;
  }

  return {
    id,
    step,
    reached,
    saved,
    error,
    pending: command.isPending,
    dirty: draftForm.formState.isDirty || roadmapForm.formState.isDirty,
    draftForm,
    roadmapForm,
    goTo,
    submitForReview,
  };
}
