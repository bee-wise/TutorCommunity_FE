"use client";

import { useRef } from "react";
import { DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { actionClass } from "./InterviewUi";

export function InterviewRubricFileInput({ file, onChange }: { file?: File; onChange: (file: File | undefined) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <div className="space-y-2"><span className="text-sm font-medium">File TOML</span><div className="flex min-w-0 flex-wrap items-center gap-3 rounded-2xl border border-input bg-background p-3">
    <input ref={input} type="file" accept=".toml" className="sr-only" tabIndex={-1} aria-label="File TOML" onChange={(event) => { onChange(event.target.files?.[0]); event.target.value = ""; }} />
    <Button type="button" variant="outline" className={actionClass} onClick={() => input.current?.click()}><DocumentTextIcon className="size-4" />Chọn file TOML</Button>
    <span className="min-w-0 flex-1 break-all text-xs text-muted-foreground">{file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : "Chưa chọn file"}</span>
    {file && <Button type="button" variant="ghost" size="icon" className={actionClass} aria-label="Bỏ file TOML" onClick={() => onChange(undefined)}><XMarkIcon className="size-4" /></Button>}
  </div></div>;
}
