"use client";

import { useState } from "react";
import { PlusIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useInterviewPoliciesQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { interviewApi } from "@workspace/core/ai-interviews/services/interview.api";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewActivationDialog } from "./InterviewActivationDialog";
import {
  useInterviewPolicyForm,
  useStaffInterviewMutation,
} from "../hooks/useInterviewActions";
import { actionClass, InterviewQueryState, panelClass } from "./InterviewUi";
import { InterviewAudit } from "./InterviewAudit";
import { InterviewPolicyEditor } from "./InterviewPolicyEditor";
import { InterviewVersions, InterviewVersionStatus } from "./InterviewVersions";

export function InterviewPolicies() {
  const query = useInterviewPoliciesQuery();
  const [version, setVersion] = useState("");
  const [activation, setActivation] = useState("");
  const [editing, setEditing] = useState(false);
  const [audit, setAudit] = useState(false);
  const model = useInterviewPolicyForm(
    query.data?.map((item) => item.version),
    (created) => {
      setVersion(created);
      setEditing(false);
    },
  );
  const selected =
    query.data?.find((item) => item.version === version) ??
    query.data?.find((item) => item.is_active) ??
    query.data?.[0];
  const activate = useStaffInterviewMutation(
    interviewApi.activatePolicy,
    "Đã áp dụng quy định mới.",
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-nunito text-xl font-extrabold">
          Quy định nền tảng
        </h2>
        <Button
          className={actionClass}
          disabled={editing || model.mutation.isPending}
          onClick={() => {
            model.form.reset({
              version: "",
              content: "",
              confirmation_text: "",
            });
            setEditing(true);
          }}
        >
          <PlusIcon className="size-4" />
          Tạo quy định mới
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
            selected={selected?.version ?? ""}
            disabled={editing}
            onSelect={(value) => {
              setVersion(value);
              setAudit(false);
            }}
          />
          <div className="min-w-0 space-y-5">
            <div hidden={!editing}>
              <InterviewPolicyEditor
                model={model}
                onCancel={() => setEditing(false)}
              />
            </div>
            {!editing &&
              (selected ? (
                <section className={panelClass}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-nunito text-xl font-extrabold">
                      Quy định {selected.version}
                    </h3>
                    <InterviewVersionStatus active={selected.is_active} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-5">
                    <Button
                      className={actionClass}
                      disabled={selected.is_active || activate.isPending}
                      onClick={() => setActivation(selected.version)}
                    >
                      Áp dụng
                    </Button>
                    <Button
                      variant="outline"
                      className={actionClass}
                      onClick={() => {
                        model.form.reset({
                          version: "",
                          content: selected.content,
                          confirmation_text: selected.confirmation_text,
                        });
                        setEditing(true);
                      }}
                    >
                      <DocumentDuplicateIcon className="size-4" />
                      Sao chép để sửa
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
                  <h4 className="mt-5 text-sm font-bold">Nội dung quy định</h4>
                  <p className="mt-3 max-h-[480px] overflow-y-auto whitespace-pre-wrap text-sm leading-7">
                    {selected.content}
                  </p>
                  <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                    <h4 className="text-xs font-bold text-primary">
                      Câu xác nhận của gia sư
                    </h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {selected.confirmation_text}
                    </p>
                  </div>
                </section>
              ) : (
                <p className={panelClass}>
                  Chưa có quy định. Tạo phiên bản đầu tiên để gia sư có thể xác
                  nhận.
                </p>
              ))}
            {!editing && audit && selected && (
              <InterviewAudit
                key={selected.version}
                entity="policy"
                id={selected.version}
                defaultOpen
              />
            )}
          </div>
        </div>
      )}
      <InterviewActivationDialog
        kind="policy"
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
