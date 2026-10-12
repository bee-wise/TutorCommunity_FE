"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  useInterviewRubricQuery,
  useInterviewRubricsQuery,
} from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewActivationDialog } from "./InterviewActivationDialog";
import {
  useInterviewRubricUpload,
  useStaffInterviewMutation,
} from "../hooks/useInterviewActions";
import { useInterviewRubricExport } from "../hooks/useInterviewRubricEditor";
import { actionClass, InterviewQueryState, panelClass } from "./InterviewUi";
import { InterviewAudit } from "./InterviewAudit";
import { InterviewRubricEditor } from "./InterviewRubricEditor";
import { InterviewRubricPreview } from "./InterviewRubricPreview";
import { InterviewRubricUpload } from "./InterviewRubricUpload";
import { InterviewVersions, InterviewVersionStatus } from "./InterviewVersions";

export function InterviewRubrics() {
  const query = useInterviewRubricsQuery();
  const [version, setVersion] = useState("");
  const [activation, setActivation] = useState("");
  const [mode, setMode] = useState<"view" | "edit" | "upload">("view");
  const [audit, setAudit] = useState(false);
  const selected =
    query.data?.find((item) => item.version === version) ??
    query.data?.find((item) => item.is_active) ??
    query.data?.[0];
  const selectedVersion = selected?.version ?? "";
  const detail = useInterviewRubricQuery(selectedVersion);
  const exportToml = useInterviewRubricExport(
    detail.data?.content,
    selectedVersion,
  );
  function onCreated(createdVersion: string) {
    setMode("view");
    setVersion(createdVersion);
    setAudit(false);
  }
  const upload = useInterviewRubricUpload(onCreated);
  const activate = useStaffInterviewMutation(
    interviewApi.activateRubric,
    "Đã áp dụng bộ câu hỏi mới.",
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-nunito text-xl font-extrabold">
          Bộ câu hỏi và barem
        </h2>
        <Button
          className={actionClass}
          disabled={mode === "edit"}
          onClick={() => setMode("upload")}
        >
          <DocumentPlusIcon className="size-4" />
          Tải bộ câu hỏi mới
        </Button>
      </div>
      <InterviewQueryState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
      {query.data && (
        <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <InterviewVersions
            items={query.data}
            selected={selectedVersion}
            disabled={mode !== "view"}
            onSelect={(value) => {
              setVersion(value);
              setAudit(false);
            }}
          />
          <div className="min-w-0 space-y-5">
            <div hidden={mode !== "upload"}>
              <InterviewRubricUpload
                model={upload}
                onCancel={() => setMode("view")}
              />
            </div>
            {mode === "edit" && detail.data && (
              <InterviewRubricEditor
                key={selectedVersion}
                content={detail.data.content}
                version={selectedVersion}
                existingVersions={query.data.map((item) => item.version)}
                onCancel={() => setMode("view")}
                onCreated={onCreated}
              />
            )}
            {mode === "view" &&
              (selected ? (
                <section className={panelClass}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-nunito text-xl font-extrabold">
                      Cấu hình {selectedVersion}
                    </h3>
                    <InterviewVersionStatus
                      active={selected.is_active}
                      fallback={selected.is_default}
                    />
                  </div>
                  {selected.note && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selected.note}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-5">
                    <Button
                      className={actionClass}
                      disabled={selected.is_active || activate.isPending}
                      onClick={() => setActivation(selectedVersion)}
                    >
                      Áp dụng
                    </Button>
                    <Button
                      variant="outline"
                      className={actionClass}
                      disabled={!detail.data}
                      onClick={() => setMode("edit")}
                    >
                      <PencilSquareIcon className="size-4" />
                      Chỉnh thành bản mới
                    </Button>
                    <Button
                      variant="outline"
                      className={actionClass}
                      disabled={!detail.data}
                      onClick={exportToml}
                    >
                      <ArrowDownTrayIcon className="size-4" />
                      Xuất TOML
                    </Button>
                    <Button
                      variant="outline"
                      className={actionClass}
                      aria-pressed={audit}
                      onClick={() => setAudit(!audit)}
                    >
                      Lịch sử
                    </Button>
                  </div>
                  <div className="mt-5">
                    <InterviewQueryState
                      pending={detail.isPending}
                      error={detail.error}
                      retry={() => void detail.refetch()}
                    />
                    {detail.data && (
                      <InterviewRubricPreview content={detail.data.content} />
                    )}
                  </div>
                </section>
              ) : (
                <p className={panelClass}>
                  Chưa có bộ câu hỏi. Tải lên file TOML để tạo phiên bản đầu
                  tiên.
                </p>
              ))}
            {mode === "view" && audit && selected && (
              <InterviewAudit
                key={selectedVersion}
                entity="rubric"
                id={selectedVersion}
                defaultOpen
              />
            )}
          </div>
        </div>
      )}
      <InterviewActivationDialog
        kind="rubric"
        version={activation}
        pending={activate.isPending}
        onClose={() => setActivation("")}
        onConfirm={() =>
          activate.mutate(activation, { onSuccess: () => setActivation("") })
        }
      />
    </div>
  );
}
