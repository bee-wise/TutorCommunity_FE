"use client";

import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { SimpleListField } from "../SimpleListField";

export function IntroductionEditDialog({ profile, onClose, onSave }: {
  profile: TutorProfileEditorValues;
  onClose: () => void;
  onSave: (values: TutorProfileEditorValues) => void;
}) {
  return (
    <ProfileBlockDialog open title="Chỉnh sửa giới thiệu" description="Tách nội dung thành các đoạn ngắn, rõ ràng và dễ đọc." profile={profile} onClose={onClose} onSave={onSave}>
      <SimpleListField name="introduction" label="Nội dung giới thiệu" itemLabel="Đoạn giới thiệu" addLabel="Thêm đoạn" reviewRequired multiline />
    </ProfileBlockDialog>
  );
}
