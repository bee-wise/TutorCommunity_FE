"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useAIClassFlow } from "../hooks/useAIClassFlow";
import { useClassMaterialsStore } from "../store/class-materials.store";
import type { MaterialClass } from "../types/class-materials.types";
import { formatMaterialDate } from "../utils/materials.utils";
import { AIFlowSteps } from "./AIFlowSteps";
import { AIBackgroundWarning } from "./AIBackgroundWarning";
import { GeneratingState } from "./GeneratingState";
import { MaterialsSelect } from "./MaterialsSelect";
import { AIActionButton } from "./AIActionButton";
import { AIReadyState, AIReadyFooter } from "./AIReadyState";
import { actionClass, outlineActionClass, inputClass } from "./materials-ui";

export function ClassAIFlowModal({
  classInfo,
  open,
  onOpenChange,
  initialMaterialId,
  initialSessionId,
}: {
  classInfo: MaterialClass;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initialMaterialId?: string;
  initialSessionId?: string;
}) {
  const flow = useAIClassFlow(classInfo, initialMaterialId, initialSessionId);
  const [warning, setWarning] = useState(false);
  const updateMaterial = useClassMaterialsStore(
    (state) => state.updateMaterial,
  );
  const readOnly = classInfo.status === "completed";
  const requestClose = (value: boolean) => {
    if (!value && flow.isRunning) setWarning(true);
    else onOpenChange(value);
  };

  function publish() {
    if (!flow.result || readOnly) return;
    updateMaterial(flow.result.id, { status: "published" });
    toast.success("Đã xuất bản cho cả lớp", {
      description: `${classInfo.learnerIds.length} học viên có thể xem tài liệu này. (Lưu cục bộ)`,
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={requestClose}>
        <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-5xl flex-col gap-5 overflow-hidden rounded-3xl border-border bg-card p-2 shadow-soft sm:rounded-[32px] sm:p-8 motion-reduce:animate-none [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button]:rounded-full">
          <div className="shrink-0 pr-10">
            <DialogTitle className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary">
              Tạo tài liệu với BeeWise AI
            </DialogTitle>
            <DialogDescription className="mt-2 leading-relaxed">
              {classInfo.title} · {classInfo.code}
            </DialogDescription>
          </div>
          <div className="shrink-0">
            <AIFlowSteps step={flow.step} />
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-2 py-2">
            {flow.step === 1 && (
              <div className="space-y-5 py-3">
                <h2 className="text-xl text-primary">
                  Bạn muốn tạo tài liệu cho buổi nào?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chỉ chọn buổi học đã hoàn thành. Tài liệu sẽ được gắn với buổi
                  học và chia sẻ chung cho lớp.
                </p>
                <div className="grid gap-3">
                  {flow.sessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      aria-pressed={flow.sessionId === session.id}
                      onClick={() => flow.setSessionId(session.id)}
                      className={`rounded-3xl border-2 bg-card p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${flow.sessionId === session.id ? "border-primary" : "border-border"}`}
                    >
                      <span className="block font-bold text-primary">
                        {session.topic}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {formatMaterialDate(session.taughtAt)} ·{" "}
                        {session.durationMinutes} phút
                      </span>
                      <span className="mt-2 block text-xs font-semibold text-muted-foreground">
                        {session.zoomTranscript
                          ? "Có bản ghi Zoom minh họa"
                          : "Chưa có bản ghi, có thể dán nội dung ở bước tiếp theo"}
                      </span>
                    </button>
                  ))}
                </div>
                {flow.sessions.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">
                    Chưa có buổi học hoàn thành để tạo tài liệu AI.
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className={actionClass}
                    disabled={!flow.session || readOnly}
                    onClick={flow.review}
                  >
                    Review nội dung
                  </button>
                </div>
              </div>
            )}
            {flow.step === 2 &&
              (flow.isRunning ? (
                <GeneratingState compact startedAt={flow.job?.startedAt} />
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl text-primary">
                    Kiểm tra nội dung buổi học
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {flow.session?.topic}
                  </p>
                  <label className="grid gap-2 text-sm font-bold">
                    Bản ghi Zoom
                    <textarea
                      value={flow.transcript}
                      onChange={(event) =>
                        flow.setTranscript(event.target.value)
                      }
                      rows={9}
                      className={`${inputClass} min-h-52 resize-y`}
                      placeholder="Dán nội dung bản ghi buổi học và kiểm tra trước khi tạo..."
                    />
                  </label>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:max-w-52">
                      <label
                        htmlFor="ai-question-count"
                        className="mb-2 block text-sm font-bold"
                      >
                        Số câu trắc nghiệm
                      </label>
                      <MaterialsSelect
                        id="ai-question-count"
                        label="Số câu trắc nghiệm"
                        value={String(flow.questions)}
                        onChange={(value) => flow.setQuestions(Number(value))}
                        options={[3, 4, 6, 10].map((count) => ({
                          value: String(count),
                          label: `${count} câu hỏi`,
                        }))}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {flow.transcript.length.toLocaleString("vi-VN")} ký tự
                    </p>
                  </div>
                  {flow.job?.status === "error" && (
                    <p role="alert" className="text-sm text-destructive">
                      {flow.job.error}
                    </p>
                  )}
                </div>
              ))}
            {flow.step === 3 && flow.result && (
              <AIReadyState
                material={flow.result}
                readOnly={readOnly}
                onPublish={publish}
              />
            )}
          </div>
          {flow.step === 2 && !flow.isRunning && (
            <footer className="flex shrink-0 flex-col gap-3 border-t border-border px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className={`${outlineActionClass} w-full sm:w-auto`}
                onClick={() => flow.setStage(1)}
              >
                Chọn lại buổi học
              </button>
              <AIActionButton
                className="w-full sm:w-auto"
                disabled={!flow.transcript.trim() || readOnly}
                onClick={flow.generate}
              >
                Tạo tài liệu AI
              </AIActionButton>
            </footer>
          )}
          {flow.step === 3 && flow.result && (
            <AIReadyFooter
              readOnly={readOnly}
              onClose={() => onOpenChange(false)}
              onRestart={flow.restart}
            />
          )}
        </DialogContent>
      </Dialog>
      <AIBackgroundWarning
        open={warning}
        onOpenChange={setWarning}
        onConfirm={() => {
          setWarning(false);
          onOpenChange(false);
          toast.warning("AI vẫn đang chạy nền", {
            description:
              "Mở lại cửa sổ AI tại lớp này để theo dõi. Không tải lại hoặc đóng tab trình duyệt.",
          });
        }}
      />
    </>
  );
}
