"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { TutorBioSection } from "../../tutor-profile/components/TutorBioSection";
import { TutorEducationAchievements } from "../../tutor-profile/components/TutorEducationAchievements";
import { TutorHero } from "../../tutor-profile/components/TutorHero";
import { TutorTeachingHistory } from "../../tutor-profile/components/TutorTeachingHistory";
import { TutorTeachingMethods } from "../../tutor-profile/components/TutorTeachingMethods";
import { useTutorProfileInlineEditor } from "../hooks/useTutorProfileInlineEditor";
import { EditableProfileBlock } from "./EditableProfileBlock";
import { ProfileEditModalRouter } from "./ProfileEditModalRouter";
import { ProfileEditorToolbar } from "./ProfileEditorToolbar";
import { TutorEvidenceEditorPreview } from "./TutorEvidenceEditorPreview";
import { TutorProfileSidebarPreview } from "./TutorProfileSidebarPreview";
import { TutorVideoEditorPreview } from "./TutorVideoEditorPreview";

export function TutorProfileEditorScreen() {
  const editor = useTutorProfileInlineEditor();

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
            <EditableProfileBlock label="Hồ sơ học thuật" onEdit={() => editor.openBlock("academic")}>
              <TutorEducationAchievements tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Video" onEdit={() => editor.openBlock("video")}>
              <TutorVideoEditorPreview src={editor.media.videoUrl} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Kinh nghiệm" onEdit={() => editor.openBlock("experience")}>
              <TutorTeachingHistory tutor={editor.tutor} />
            </EditableProfileBlock>
            <EditableProfileBlock label="Minh chứng" onEdit={() => editor.openBlock("evidence")}>
              <TutorEvidenceEditorPreview certificates={editor.tutor.certificates} />
            </EditableProfileBlock>
          </div>

          <TutorProfileSidebarPreview tutor={editor.tutor} />
        </div>
      </main>

      <ProfileEditModalRouter
        activeBlock={editor.activeBlock}
        profile={editor.profile}
        videoUrl={editor.media.videoUrl}
        onClose={editor.closeBlock}
        onSaveProfile={editor.saveBlock}
        onSaveVideo={(videoUrl) => {
          editor.setVideoUrl(videoUrl);
          editor.closeBlock();
        }}
      />
    </div>
  );
}
