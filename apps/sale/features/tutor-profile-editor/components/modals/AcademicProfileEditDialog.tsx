"use client";

import { useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import { SimpleListField } from "../SimpleListField";

function AcademicProfileFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField
          id="university"
          label="Trường học"
          reviewRequired
          error={errors.university}
          registration={register("university")}
        />
        <ProfileField
          id="major"
          label="Chuyên ngành"
          reviewRequired
          error={errors.major}
          registration={register("major")}
        />
      </div>
      <ProfileField
        id="student-year"
        label="Tình trạng học tập"
        description="Ví dụ: Sinh viên năm 3, Đã tốt nghiệp."
        reviewRequired
        error={errors.studentYear}
        registration={register("studentYear")}
      />
      <SimpleListField
        name="education"
        label="Học vấn"
        itemLabel="Thông tin học vấn"
        addLabel="Thêm học vấn"
        description="Mỗi thông tin được hiển thị thành một mục riêng trên hồ sơ."
        reviewRequired
        multiline
      />
      <SimpleListField
        name="achievements"
        label="Thành tích"
        itemLabel="Thành tích"
        addLabel="Thêm thành tích"
        description="Chỉ nhập nội dung có thể công khai và cung cấp minh chứng khi cần."
        reviewRequired
        multiline
      />
    </>
  );
}

export function AcademicProfileEditDialog({
  profile,
  onClose,
  onSave,
}: {
  profile: TutorProfileEditorValues;
  onClose: () => void;
  onSave: (values: TutorProfileEditorValues) => void;
}) {
  return (
    <ProfileBlockDialog
      open
      title="Chỉnh sửa hồ sơ học thuật"
      description="Cập nhật trường học, chuyên ngành, tình trạng học tập và các thành tích công khai."
      profile={profile}
      onClose={onClose}
      onSave={onSave}
    >
      <AcademicProfileFields />
    </ProfileBlockDialog>
  );
}
