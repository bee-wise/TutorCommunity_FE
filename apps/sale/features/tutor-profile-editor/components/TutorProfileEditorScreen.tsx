"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { TutorBioSection } from "../../tutor-profile/components/TutorBioSection";
import { TutorAchievements } from "../../tutor-profile/components/TutorAchievements";
import { TutorHero } from "../../tutor-profile/components/TutorHero";
import { TutorTeachingHistory } from "../../tutor-profile/components/TutorTeachingHistory";
import { TutorTeachingMethods } from "../../tutor-profile/components/TutorTeachingMethods";
import { useTutorProfileInlineEditor } from "../hooks/useTutorProfileInlineEditor";
import { EditableProfileBlock } from "./EditableProfileBlock";
import { ProfileEditDialogs } from "./dialogs/ProfileEditDialogs";
import { ProfileEditorSkeleton } from "./ProfileEditorSkeleton";
import { ProfileEditorToolbar } from "./ProfileEditorToolbar";
import { TutorEvidenceEditorPreview } from "./TutorEvidenceEditorPreview";
import { TutorProfileSidebarPreview } from "./TutorProfileSidebarPreview";
import { TutorVideoEditorPreview } from "./TutorVideoEditorPreview";

export function TutorProfileEditorScreen() {
  const editor = useTutorProfileInlineEditor();

  if (editor.isLoading) {
    return <ProfileEditorSkeleton />;
  }

  if (editor.isError && !editor.isDevPreview) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="font-nunito text-xl font-bold text-foreground">
          Không thể tải thông tin hồ sơ
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Đã có lỗi xảy ra trong quá trình tải dữ liệu hồ sơ. Vui lòng thử lại.
        </p>
        <button
          type="button"
          onClick={() => void editor.refetch()}
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(250,220,120,0.55),transparent_34%),linear-gradient(180deg,#fff3cb_0%,#fffaf0_38%,#ffffff_100%)] text-[#17142f]">
      <ProfileEditorToolbar isSubmitting={editor.isSubmitting} onSubmit={editor.submitForReview} />

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 lg:px-8">
        {editor.submittedAt ? (
          <div role="status" className="flex gap-3 rounded-2xl border border-[#447353]/30 bg-white/90 p-4 text-sm text-[#234b31] shadow-sm">
            <CheckCircleIcon className="mt-0.5 shrink-0" size={20} weight="fill" />
            <p className="leading-6">
              Hồ sơ đã được gửi xét duyệt lại. Phiên bản công khai hiện tại vẫn được giữ cho đến khi nội dung mới được duyệt.
            </p>
          </div>
        ) : null}

        <EditableProfileBlock label="Thông tin cơ bản" onEdit={() => editor.openBlock("basic")}>
          <TutorHero tutor={editor.tutor} />
        </EditableProfileBlock>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)] lg:items-start">
          <div className="space-y-6">
            <EditableProfileBlock label="Giới thiệu" onEdit={() => editor.openBlock("introduction")}>
              <TutorBioSection tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Phương pháp" onEdit={() => editor.openBlock("methods")}>
              <TutorTeachingMethods tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Học vấn" onEdit={() => editor.openBlock("academic")}>
              <TutorAchievements tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Video" onEdit={() => editor.openBlock("video")}>
              <TutorVideoEditorPreview src={editor.profile.videoUrl} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Kinh nghiệm" onEdit={() => editor.openBlock("experience")}>
              <TutorTeachingHistory tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Minh chứng" onEdit={() => editor.openBlock("evidence")}>
              <TutorEvidenceEditorPreview certificates={editor.tutor.achievements} />
            </EditableProfileBlock>
          </div>

          <TutorProfileSidebarPreview
            tutor={editor.tutor}
            onEdit={() => editor.openBlock("teaching")}
          />
        </div>
      </main>

      <ProfileEditDialogs
        activeBlock={editor.activeBlock}
        profile={editor.profile}
        isSaving={editor.isSaving}
        onClose={editor.closeBlock}
        onSave={editor.saveSection}
      />
    </div>
  );
}
