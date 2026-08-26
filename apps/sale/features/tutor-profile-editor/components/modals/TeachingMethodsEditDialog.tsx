"use client";

import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { TeachingMethodListField } from "../TeachingMethodListField";

export function TeachingMethodsEditDialog({ profile, onClose, onSave }: {
  profile: TutorProfileEditorValues;
  onClose: () => void;
  onSave: (values: TutorProfileEditorValues) => void;
}) {
  return (
    <ProfileBlockDialog open title="Chỉnh sửa phương pháp giảng dạy" description="Mô tả cách bạn tổ chức buổi học và theo dõi tiến bộ." profile={profile} onClose={onClose} onSave={onSave}>
      <TeachingMethodListField />
    </ProfileBlockDialog>
  );
}
