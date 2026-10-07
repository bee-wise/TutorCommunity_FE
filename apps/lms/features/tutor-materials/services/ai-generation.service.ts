import type { QueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { aiAnalyze } from "../api/analyze.api";
import { useAIJobsStore } from "../store/ai-jobs.store";
import {
  canEditClass,
  useClassMaterialsStore,
} from "../store/class-materials.store";
import type { AIAnalyzeRequest } from "../types";
import { CLASS_SESSIONS } from "../data/classroom.mock";

export function startClassGeneration(
  queryClient: QueryClient,
  classId: string,
  sessionId: string,
  input: AIAnalyzeRequest,
) {
  const existing = useAIJobsStore.getState().jobs[classId];
  if (!canEditClass(classId) || existing?.status === "running") return;
  if (!CLASS_SESSIONS.some((session) => session.id === sessionId && session.classId === classId && session.completed) || !input.transcript.trim()) return;
  const job = {
    id: crypto.randomUUID(),
    classId,
    sessionId,
    startedAt: Date.now(),
    status: "running" as const,
  };
  useAIJobsStore.getState().setJob(job);

  // The mutation belongs to QueryClient, not a dialog observer. Closing/unmounting
  // the dialog never cancels the request or drops its completion callbacks.
  const mutation = queryClient.getMutationCache().build(queryClient, {
    mutationKey: ["tutorMaterials", "classGeneration", classId],
    mutationFn: aiAnalyze,
    retry: false,
    onSuccess: (data) => {
      const materialId = `ai-${job.id}`;
      useClassMaterialsStore.getState().addMaterial({
        id: materialId,
        classId,
        sessionId,
        title: data.summary.title,
        source: "ai",
        status: "draft",
        fileType: "BEEWISE",
        data,
        updatedAt: new Date().toISOString(),
      });
      useAIJobsStore.getState().setJob({ ...job, status: "ready", materialId });
      toast.success("Tài liệu AI đã sẵn sàng", {
        description:
          "Đã lưu bản nháp. Hãy kiểm tra trước khi xuất bản cho cả lớp.",
      });
    },
    onError: (error: Error) => {
      useAIJobsStore
        .getState()
        .setJob({ ...job, status: "error", error: error.message });
      toast.error("Không thể tạo tài liệu AI", { description: error.message });
    },
  });
  void mutation.execute(input).catch(() => {
    /* Error is surfaced and retained by onError. */
  });
}
