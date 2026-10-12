"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import { actionClass } from "./InterviewUi";
import { InterviewPolicies } from "./InterviewPolicies";
import { InterviewRubrics } from "./InterviewRubrics";

export function InterviewSettingsScreen() {
  const role = useAuthStore((state) => state.user?.role?.toLowerCase());
  const [tab, setTab] = useState<"policy" | "rubric">("policy");
  if (role !== "admin")
    return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-nunito text-3xl leading-[1.2] font-black">
          Cấu hình phỏng vấn AI
        </h1>
        <Button asChild variant="outline" className={actionClass}>
          <Link href="/admin/ai-interviews">
            <ArrowLeftIcon className="size-4" />
            Danh sách phỏng vấn
          </Link>
        </Button>
      </div>
      <nav
        className="flex gap-2 overflow-x-auto border-b border-border pb-4"
        aria-label="Chọn cấu hình"
      >
        <Button
          variant={tab === "policy" ? "default" : "outline"}
          aria-pressed={tab === "policy"}
          className={`shrink-0 ${actionClass}`}
          onClick={() => setTab("policy")}
        >
          <DocumentTextIcon className="size-4" />
          Quy định nền tảng
        </Button>
        <Button
          variant={tab === "rubric" ? "default" : "outline"}
          aria-pressed={tab === "rubric"}
          className={`shrink-0 ${actionClass}`}
          onClick={() => setTab("rubric")}
        >
          <AdjustmentsHorizontalIcon className="size-4" />
          Bộ câu hỏi và barem
        </Button>
      </nav>
      <div hidden={tab !== "policy"}>
        <InterviewPolicies />
      </div>
      <div hidden={tab !== "rubric"}>
        <InterviewRubrics />
      </div>
    </main>
  );
}
