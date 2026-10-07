"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadSimple } from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { validateMaterialFile, saveLocalFile } from "../services/local-files.service";
import { useClassMaterialsStore, canEditClass } from "../store/class-materials.store";
import { getMaterialFileType } from "../utils/materials.utils";
import type { ClassSession, MaterialClass } from "../types/class-materials.types";
import { MaterialsSelect } from "./MaterialsSelect";
import { actionClass, outlineActionClass, inputClass } from "./materials-ui";

const UploadSchema = z.object({ title: z.string().trim().min(1, "Nhập tên tài liệu").max(200, "Tên tài liệu tối đa 200 ký tự") });
type UploadValues = z.infer<typeof UploadSchema>;
export function ClassUploadSpace({ classInfo, sessions }: { classInfo: MaterialClass; sessions: ClassSession[] }) {
  const picker = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const [publish, setPublish] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<UploadValues>({ resolver: zodResolver(UploadSchema), defaultValues: { title: "" } });
  const locked = !canEditClass(classInfo.id) || sessions.length === 0;

  function chooseFile(next: File | undefined) {
    if (!next || locked || isSubmitting) return;
    const error = validateMaterialFile(next);
    setFileError(error);
    if (error) { setFile(null); return; }
    setFile(next);
    setValue("title", next.name.replace(/\.[^.]+$/, ""), { shouldValidate: true });
  }
  const upload = handleSubmit(async ({ title }) => {
    if (!file || locked || !sessions.some((item) => item.id === sessionId)) return;
    try {
      const id = `upload-${crypto.randomUUID()}`;
      await saveLocalFile(id, file);
      useClassMaterialsStore.getState().addMaterial({
        id, classId: classInfo.id, sessionId, title, source: "upload", status: publish ? "published" : "draft",
        fileType: getMaterialFileType(file), fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        hasLocalFile: true, updatedAt: new Date().toISOString(),
      });
      toast.success(publish ? "Đã xuất bản cho cả lớp" : "Đã lưu bản nháp", { description: "Tệp được lưu cục bộ trên trình duyệt; chưa upload lên backend." });
      setFile(null); reset(); setPublish(false);
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "Không thể lưu tài liệu. Vui lòng thử lại.");
    }
  });

  return (
    <section aria-labelledby="upload-space-title" className="space-y-4">
      <h2 id="upload-space-title" className="text-xl leading-[1.25] text-primary">Không gian tài liệu của lớp</h2>
      <div
        onDragOver={(event) => { event.preventDefault(); if (!locked && !isSubmitting) setDragging(true); }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length > 1) { setFileError("Chọn một tài liệu mỗi lần tải lên."); return; } chooseFile(event.dataTransfer.files[0]); }}
        className={`grid min-h-48 place-items-center rounded-3xl border-2 border-dashed bg-card px-5 py-6 text-center ${dragging ? "border-primary" : "border-border"}`}
      >
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><UploadSimple size={25} weight="bold" aria-hidden="true" /></span>
          <p className="mt-3 font-bold text-primary">{file ? file.name : "Kéo thả tài liệu vào đây"}</p>
          <p className="mt-2 text-sm text-muted-foreground">PDF, DOCX, PPTX (tối đa 20 MB mỗi tệp)</p>
          <button type="button" disabled={locked || isSubmitting} onClick={() => picker.current?.click()} className={`${outlineActionClass} mt-4`}>{file ? "Chọn tệp khác" : "Chọn tài liệu"}</button>
          <input ref={picker} type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ""; }} aria-label="Chọn tài liệu tải lên" />
        </div>
      </div>
      {locked && <p className="text-sm text-muted-foreground">{classInfo.status === "completed" ? "Lớp đã kết thúc. Bạn chỉ có thể xem tài liệu đã lưu." : "Chưa có buổi học. Tài liệu cần được gắn với một buổi học của lớp."}</p>}
      {fileError && <p role="alert" className="text-sm text-destructive">{fileError}</p>}
      {file && !locked && (
        <form onSubmit={upload} className="space-y-4 rounded-3xl border border-border bg-card p-4">
          <label className="grid gap-2 text-sm font-bold">Tên tài liệu<input {...register("title")} className={inputClass} aria-invalid={Boolean(errors.title)} disabled={isSubmitting} /></label>
          {errors.title && <p role="alert" className="text-sm text-destructive">{errors.title.message}</p>}
          <div><label htmlFor="upload-session" className="mb-2 block text-sm font-bold">Gắn với buổi học</label><MaterialsSelect id="upload-session" label="Buổi học của tài liệu" value={sessionId} onChange={setSessionId} disabled={isSubmitting} options={sessions.map((session) => ({ value: session.id, label: session.topic }))} /></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Trạng thái lưu tài liệu">
            <button type="button" disabled={isSubmitting} aria-pressed={!publish} onClick={() => setPublish(false)} className={`${outlineActionClass} ${!publish ? "!border-primary" : ""}`}>Lưu bản nháp</button>
            <button type="button" disabled={isSubmitting} aria-pressed={publish} onClick={() => setPublish(true)} className={`${outlineActionClass} ${publish ? "!border-primary" : ""}`}>Xuất bản cho cả lớp</button>
          </div>
          <p className="text-xs text-muted-foreground">{publish ? `Tài liệu được chia sẻ chung cho ${classInfo.learnerIds.length} học viên.` : "Bản nháp chỉ hiển thị với gia sư."}</p>
          <button type="submit" disabled={isSubmitting} className={actionClass}>{isSubmitting ? "Đang lưu tài liệu..." : "Lưu tài liệu"}</button>
        </form>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">Bản mock: tệp được lưu trong bộ nhớ trình duyệt, không gửi lên máy chủ hoặc tài khoản học viên thực tế.</p>
    </section>
  );
}
