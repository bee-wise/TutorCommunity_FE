"use client";

import { useState, type ChangeEvent } from "react";
import { DownloadSimple, FileArrowUp, CheckCircle } from "@phosphor-icons/react";
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

  return <div className="h-[100dvh] overflow-hidden bg-[#F8FAFC]"><div className="mx-auto flex h-full max-w-[1100px] flex-col gap-3 p-3 sm:p-4">
    <ExerciseWorkspaceHeader exercise={exercise} helperText={overdue ? "Bài tập đã quá hạn nộp. Bạn vẫn có thể tải đề để luyện tập." : "Tải đề, hoàn thành bài và nộp một tệp PDF, DOC hoặc DOCX."} />
    <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
      <section className="min-h-0 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-extrabold text-slate-950">Đề bài từ gia sư</h2><div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#F8FAFC] p-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{exercise.attachmentName}</p><p className="mt-1 text-xs text-slate-500">Tài liệu gắn với buổi học: {exercise.lessonTopic}</p></div><button type="button" onClick={handleDownload} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#280F91]/20 px-4 text-sm font-bold text-[#280F91] hover:bg-[#EEF2FF]"><DownloadSimple size={18} weight="bold" />Tải đề bài</button></div></section>
      {fileSubmitted ? <section className="min-h-0 rounded-2xl border border-[#B8D9C3] bg-white p-6 text-center"><CheckCircle className="mx-auto text-[#447353]" size={38} weight="fill" /><h2 className="mt-3 text-xl font-extrabold text-slate-950">Bài làm đã được nộp</h2><p className="mt-1 text-sm text-slate-500">{submittedFileName ?? "Tệp bài làm"}</p><p className="mt-3 text-sm leading-6 text-slate-600">Gia sư sẽ nhận xét sau khi xem bài. Bạn vẫn có thể tải đề để luyện lại.</p></section> : overdue ? <section className="min-h-0 rounded-2xl border border-[#E1ABA7] bg-white p-5"><h2 className="font-extrabold text-[#8A3730]">Đã hết hạn nộp bài</h2><p className="mt-1 text-sm leading-6 text-slate-600">Hãy nhắn cho gia sư nếu bạn cần được mở lại thời hạn.</p></section> : <section className="min-h-0 overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-extrabold text-slate-950">Nộp bài làm</h2><label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-[#280F91]/30 bg-[#EEF2FF]/50 px-4 py-6 text-center hover:bg-[#EEF2FF]"><FileArrowUp size={28} className="text-[#280F91]" weight="duotone" /><span className="mt-2 text-sm font-bold text-[#280F91]">Chọn tệp bài làm</span><span className="mt-1 text-xs text-slate-500">PDF, DOC hoặc DOCX, tối đa 10 MB</span><input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="sr-only" /></label>{selectedFile ? <p className="mt-3 text-sm font-semibold text-slate-700">Đã chọn: {selectedFile.name}</p> : null}{error ? <p className="mt-2 text-sm font-semibold text-[#8A3730]" role="alert">{error}</p> : null}<button type="button" disabled={!selectedFile} onClick={() => setConfirmOpen(true)} className="mt-4 h-11 w-full rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#1F0B70] disabled:cursor-not-allowed disabled:opacity-40">Nộp tệp bài làm</button></section>}
    </div>
  </div><SubmitExerciseDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Nộp tệp bài làm?" description={`Tệp ${selectedFile?.name ?? "đã chọn"} sẽ được gửi cho gia sư. Bạn không thể thay đổi trong bản mock sau khi nộp.`} confirmLabel="Xác nhận nộp" onConfirm={() => selectedFile && onSubmit(selectedFile.name)} /></div>;
}
