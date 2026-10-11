"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import { actionClass } from "./InterviewUi";
import { InterviewPolicies } from "./InterviewPolicies";
import { InterviewRubrics } from "./InterviewRubrics";

export function InterviewSettingsScreen() {
  const role = useAuthStore((state) => state.user?.role?.toLowerCase());
  const [tab, setTab] = useState<"policy" | "rubric">("policy");
  if (role !== "admin") return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  return <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Cấu hình phỏng vấn AI</h1><Button asChild variant="outline" className={actionClass}><Link href="/admin/ai-interviews">Danh sách phỏng vấn</Link></Button></div><div className="flex flex-wrap gap-2" aria-label="Chọn cấu hình"><Button variant={tab === "policy" ? "default" : "outline"} aria-pressed={tab === "policy"} className={actionClass} onClick={() => setTab("policy")}>Quy định nền tảng</Button><Button variant={tab === "rubric" ? "default" : "outline"} aria-pressed={tab === "rubric"} className={actionClass} onClick={() => setTab("rubric")}>Bộ câu hỏi và barem</Button></div>{tab === "policy" ? <InterviewPolicies /> : <InterviewRubrics />}</main>;
}
