"use client";

import Link from "next/link";
import { FileText, MagicWand } from "@phosphor-icons/react";
import type { AIAnalyzeRequest, LearningSession } from "../types";

interface TranscriptWorkspaceProps {
  session: LearningSession;
  hasAiMaterial: boolean;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onGenerate: (data: AIAnalyzeRequest) => void;
  errorMessage?: string;
}

export function TranscriptWorkspace({
  session,
  hasAiMaterial,
  transcript,
  onTranscriptChange,
  onGenerate,
  errorMessage,
}: TranscriptWorkspaceProps) {
  const canGenerate = transcript.trim().length > 0;

  function handleGenerate() {
    if (!canGenerate) return;
    onGenerate({
      transcript: transcript.trim(),
      subject: session.subject,
      num_questions: 4,
    });
  }

  return (
    <section className="min-w-0 rounded-xl border border-border bg-card" aria-labelledby="transcript-title">
      <div className="border-b border-border px-5 py-5 sm:px-7 sm:py-6">
        <h2 id="transcript-title" className="font-nunito text-xl font-extrabold text-foreground">
          Bản ghi buổi học
        </h2>
        <p id="transcript-help" className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Dán nội dung từ Zoom và kiểm tra lại trước khi để BeeWise AI tạo tóm tắt, bài tập.
        </p>
      </div>

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <label htmlFor="lesson-transcript" className="block text-sm font-bold text-foreground">
          Nội dung bản ghi
        </label>
        <textarea
          id="lesson-transcript"
          value={transcript}
          onChange={(event) => onTranscriptChange(event.target.value)}
          aria-describedby={`transcript-help${errorMessage ? " transcript-error" : ""}`}
          aria-invalid={Boolean(errorMessage)}
          rows={14}
          placeholder="Dán nội dung buổi học vào đây..."
          className="mt-2 min-h-[320px] w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[400px]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{canGenerate ? "Có thể tạo tài liệu từ bản ghi này" : "Dán nội dung để bật tính năng tạo AI"}</span>
          <span>{transcript.length.toLocaleString("vi-VN")} ký tự</span>
        </div>
        {errorMessage && (
          <p id="transcript-error" role="alert" className="mt-3 text-sm font-medium text-destructive">
            Không thể tạo tài liệu: {errorMessage}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
        {hasAiMaterial && (
          <Link
            href={`/lms/tutor/materials/${session.id}/preview`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-card px-4 text-sm font-bold text-primary hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FileText size={18} aria-hidden="true" />
            Xem bản lưu
          </Link>
        )}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e8ebf0] disabled:text-[#475569] disabled:hover:translate-y-0 motion-reduce:transition-none"
        >
          <MagicWand size={18} weight="bold" aria-hidden="true" />
          Tạo tài liệu bằng AI
        </button>
      </div>
    </section>
  );
}
