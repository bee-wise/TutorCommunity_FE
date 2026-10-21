"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowDownTrayIcon as DownloadSimple, DocumentPlusIcon as FileArrowUp, CheckCircleIcon as CheckCircle } from "@heroicons/react/24/outline";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import type { LearnerExercise } from "../types/learner-exercises.types";
import { downloadMockExercise } from "../utils/learner-exercises.utils";
import { ExerciseWorkspaceHeader } from "./ExerciseWorkspaceHeader";
import { SubmitExerciseDialog } from "./SubmitExerciseDialog";

export function FileExerciseWorkspace({ exercise, submittedFileName, fileSubmitted, onSubmit }: { exercise: LearnerExercise; submittedFileName?: string; fileSubmitted: boolean; onSubmit: (fileName: string) => void }) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const overdue = exercise.status === "overdue";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Tệp bài làm không được vượt quá 10 MB."); event.target.value = ""; return; }
    setSelectedFile(file);
  }

  function handleDownload() {
    downloadMockExercise(exercise);
    toast.success("Đã tải đề bài mock", { description: exercise.attachmentName });
  }

  return <div className="h-[100dvh] overflow-hidden bg-muted"><div className="mx-auto flex h-full max-w-[1100px] flex-col gap-3 p-3 sm:p-4">
    <ExerciseWorkspaceHeader exercise={exercise} helperText={overdue ? "Bài tập đã quá hạn nộp. Bạn vẫn có thể tải đề để luyện tập." : "Tải đề, hoàn thành bài và nộp một tệp PDF, DOC hoặc DOCX."} />
    <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
      <section className="min-h-0 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"><h2 className="text-lg font-extrabold text-foreground">Đề bài từ gia sư</h2><div className="mt-4 flex flex-col gap-3 rounded-xl bg-muted p-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{exercise.attachmentName}</p><p className="mt-1 text-xs text-muted-foreground">Tài liệu gắn với buổi học: {exercise.lessonTopic}</p></div><button type="button" onClick={handleDownload} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/20 px-4 text-sm font-bold text-primary hover:bg-muted"><DownloadSimple width={18} height={18} />Tải đề bài</button></div></section>
      {fileSubmitted ? <section className="min-h-0 rounded-3xl border border-secondary/30 bg-card p-6 text-center"><CheckCircle className="mx-auto text-foreground" width={38} height={38} /><h2 className="mt-3 text-xl font-extrabold text-foreground">Bài làm đã được nộp</h2><p className="mt-1 text-sm text-muted-foreground">{submittedFileName ?? "Tệp bài làm"}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Gia sư sẽ nhận xét sau khi xem bài. Bạn vẫn có thể tải đề để luyện lại.</p></section> : overdue ? <section className="min-h-0 rounded-3xl border border-error bg-card p-5"><h2 className="font-extrabold text-destructive">Đã hết hạn nộp bài</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Hãy nhắn cho gia sư nếu bạn cần được mở lại thời hạn.</p></section> : <section className="min-h-0 overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"><h2 className="text-lg font-extrabold text-foreground">Nộp bài làm</h2><label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-primary/30 bg-muted/50 px-4 py-6 text-center hover:bg-muted"><FileArrowUp width={28} height={28} className="text-primary" /><span className="mt-2 text-sm font-bold text-primary">Chọn tệp bài làm</span><span className="mt-1 text-xs text-muted-foreground">PDF, DOC hoặc DOCX, tối đa 10 MB</span><input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="sr-only" /></label>{selectedFile ? <p className="mt-3 text-sm font-semibold text-foreground">Đã chọn: {selectedFile.name}</p> : null}{error ? <p className="mt-2 text-sm font-semibold text-destructive" role="alert">{error}</p> : null}<button type="button" disabled={!selectedFile} onClick={() => setConfirmOpen(true)} className="mt-4 h-11 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">Nộp tệp bài làm</button></section>}
    </div>
  </div><SubmitExerciseDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Nộp tệp bài làm?" description={`Tệp ${selectedFile?.name ?? "đã chọn"} sẽ được gửi cho gia sư. Bạn không thể thay đổi trong bản mock sau khi nộp.`} confirmLabel="Xác nhận nộp" onConfirm={() => selectedFile && onSubmit(selectedFile.name)} /></div>;
}
