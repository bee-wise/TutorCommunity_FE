"use client";

import { useState, type FormEvent } from "react";
import { FileArrowUp, UploadSimple } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { Learner, LearningSession } from "../types";

interface UploadMaterialDialogProps {
  learner: Learner | null;
  sessions: LearningSession[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (sessionId: string, file: File, title: string, saveAsDraft: boolean) => void;
}

export function UploadMaterialDialog({
  learner,
  sessions,
  open,
  onOpenChange,
  onUpload,
}: UploadMaterialDialogProps) {
  const [sessionId, setSessionId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  if (!learner) return null;

  const selectedSessionId = sessions.some((session) => session.id === sessionId)
    ? sessionId
    : (sessions[0]?.id ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !selectedSessionId || !title.trim()) return;
    onUpload(selectedSessionId, file, title.trim(), saveAsDraft);
    setTitle("");
    setFile(null);
    setSaveAsDraft(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-extrabold">Tải tài liệu cho học viên</DialogTitle>
            <DialogDescription>
              Gắn tài liệu vào một buổi học của {learner.fullName} để dễ theo dõi.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Buổi học</span>
              <select
                required
                value={selectedSessionId}
                onChange={(event) => setSessionId(event.target.value)}
                className="h-11 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25"
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.subject} - {session.topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold">Tên tài liệu</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Bài tập ôn tập chương 2"
                className="h-11 rounded-xl border border-input bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#280F91]/25"
              />
            </label>

            <label className="grid cursor-pointer gap-2">
              <span className="text-sm font-bold">Tệp tài liệu</span>
              <span className="grid min-h-28 place-items-center rounded-xl border border-dashed border-[#280F91]/30 bg-[#CFE1FA]/20 p-4 text-center transition-colors hover:bg-[#CFE1FA]/35">
                <FileArrowUp size={28} weight="duotone" className="text-[#280F91]" aria-hidden="true" />
                <span className="mt-2 block text-sm font-bold text-[#280F91]">
                  {file?.name ?? "Chọn tệp PDF, DOCX hoặc PPTX"}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">Tối đa 20 MB</span>
              </span>
              <input
                required
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-border p-3">
              <input
                type="checkbox"
                checked={saveAsDraft}
                onChange={(event) => setSaveAsDraft(event.target.checked)}
                className="mt-0.5 size-4 accent-[#280F91]"
              />
              <span>
                <span className="block text-sm font-bold">Lưu dưới dạng bản nháp</span>
                <span className="block text-xs text-muted-foreground">Học viên chưa nhìn thấy tài liệu cho đến khi bạn chia sẻ.</span>
              </span>
            </label>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-input px-4 text-sm font-bold hover:bg-muted">
              Hủy
            </button>
            <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#280F91] px-5 text-sm font-bold text-white hover:bg-[#280F91]/90">
              <UploadSimple size={17} weight="bold" aria-hidden="true" />
              Tải tài liệu
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
