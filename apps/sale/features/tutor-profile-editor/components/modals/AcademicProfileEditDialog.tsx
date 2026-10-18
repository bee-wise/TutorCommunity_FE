"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { CatalogSelect } from "../../../tutor-profile-registration/components/CatalogSelect";
import { ProfileSelect } from "../../../tutor-profile-registration/components/ProfileSelect";
import { STUDENT_YEAR_OPTIONS } from "../../../tutor-profile-registration/constants/student-year.constants";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { SimpleListField } from "../SimpleListField";

function AcademicProfileFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#17142f]">
            Trường đại học <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="university"
            render={({ field }) => (
              <CatalogSelect
                resource="universities"
                valueMode="name"
                value={field.value}
                onChange={(val: string | string[]) => field.onChange(String(val))}
                placeholder="Tìm trường đại học..."
              />
            )}
          />
          {errors.university && (
            <p className="text-xs font-medium text-red-600">
              {errors.university.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#17142f]">
            Chuyên ngành <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="major"
            render={({ field }) => (
              <CatalogSelect
                resource="majors"
                valueMode="name"
                value={field.value}
                onChange={(val: string | string[]) => field.onChange(String(val))}
                placeholder="Tìm chuyên ngành..."
              />
            )}
          />
          {errors.major && (
            <p className="text-xs font-medium text-red-600">
              {errors.major.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#17142f]">
          Năm học / tình trạng học tập <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="studentYear"
          render={({ field }) => (
            <ProfileSelect
              label="Tình trạng học tập"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Chọn năm học / tình trạng học tập"
              options={STUDENT_YEAR_OPTIONS}
            />
          )}
        />
        {errors.studentYear && (
          <p className="text-xs font-medium text-red-600">
            {errors.studentYear.message}
          </p>
        )}
      </div>

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
