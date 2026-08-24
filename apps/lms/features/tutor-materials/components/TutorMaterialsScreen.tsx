"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { MOCK_SESSIONS } from "../mockData";
import { useMaterialsLibrary } from "../hooks/useMaterialsLibrary";
import type { Learner, MaterialCoverageFilter } from "../types";
import { LearnerMaterialsList } from "./LearnerMaterialsList";
import { UploadMaterialDialog } from "./UploadMaterialDialog";

export function TutorMaterialsScreen() {
  const library = useMaterialsLibrary();
  const [uploadLearner, setUploadLearner] = useState<Learner | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const learnerSessions = useMemo(
    () => MOCK_SESSIONS.filter((session) => session.learnerId === uploadLearner?.id),
    [uploadLearner],
  );

  function openUpload(learner: Learner) {
    setUploadLearner(learner);
    setUploadOpen(true);
  }

  function handleUpload(
    sessionId: string,
    file: File,
    title: string,
    saveAsDraft: boolean,
  ) {
    if (!uploadLearner) return;
    library.uploadMaterial(uploadLearner.id, sessionId, file, title, saveAsDraft);
    toast.success(saveAsDraft ? "Đã lưu bản nháp" : "Đã tải tài liệu", {
      description: `${title} đã được gắn với ${uploadLearner.fullName}.`,
    });
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">Quản lý tài liệu</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Theo dõi tài liệu theo từng học viên, môn học và buổi học đã hoàn thành.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc học viên">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(240px,1fr)_200px_210px]">
            <label className="relative block">
              <span className="sr-only">Tìm tên học viên</span>
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                value={library.search}
                onChange={(event) => library.setSearch(event.target.value)}
                placeholder="Tìm theo tên học viên..."
                className="h-10 w-full rounded-xl border border-input bg-white pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#280F91]/25"
              />
            </label>
            <label>
              <span className="sr-only">Lọc theo môn học</span>
              <select value={library.subject} onChange={(event) => library.setSubject(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#280F91]/25">
                <option value="all">Tất cả môn học</option>
                {library.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Lọc theo tình trạng tài liệu</span>
              <select value={library.coverage} onChange={(event) => library.setCoverage(event.target.value as MaterialCoverageFilter)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#280F91]/25">
                <option value="all">Tất cả tình trạng</option>
                <option value="missing">Có buổi thiếu tài liệu</option>
                <option value="complete">Đã đủ tài liệu</option>
              </select>
            </label>
          </div>
        </section>

        <LearnerMaterialsList summaries={library.filteredLearners} onUpload={openUpload} />
      </div>

      <UploadMaterialDialog
        learner={uploadLearner}
        sessions={learnerSessions}
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </div>
  );
}
