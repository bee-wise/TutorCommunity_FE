"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CatalogSelect } from "../../../tutor-profile-registration/components/CatalogSelect";
import { ProfileField } from "../../../tutor-profile-registration/components/ProfileField";
import { ProfileSelect } from "../../../tutor-profile-registration/components/ProfileSelect";
import { STUDENT_YEAR_OPTIONS } from "../../../tutor-profile-registration/constants/student-year.constants";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["universityId", "majorId", "studentYear"] as const;

function AcademicFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();

  return (
    <>
      <div className="grid items-start gap-5 sm:grid-cols-2">
        <ProfileField label="Trường đại học" required interactive error={errors.universityId?.message}>
          <Controller
            control={control}
            name="universityId"
            render={({ field }) => (
              <CatalogSelect
                resource="universities"
                value={field.value}
                onChange={(value) => field.onChange(String(value))}
                placeholder="Tìm trường đại học..."
              />
            )}
          />
        </ProfileField>
        <ProfileField label="Chuyên ngành" required interactive error={errors.majorId?.message}>
          <Controller
            control={control}
            name="majorId"
            render={({ field }) => (
              <CatalogSelect
                resource="majors"
                value={field.value}
                onChange={(value) => field.onChange(String(value))}
                placeholder="Tìm chuyên ngành..."
              />
            )}
          />
        </ProfileField>
      </div>
      <ProfileField label="Năm học / tình trạng học tập" required interactive error={errors.studentYear?.message}>
        <Controller
          control={control}
          name="studentYear"
          render={({ field }) => (
            <ProfileSelect
              label="Năm học / tình trạng học tập"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={Boolean(errors.studentYear)}
              placeholder="Chọn năm học / tình trạng học tập"
              options={STUDENT_YEAR_OPTIONS}
            />
          )}
        />
      </ProfileField>
    </>
  );
}

export function AcademicDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      size="md"
      fields={FIELDS}
      title="Chỉnh sửa học vấn"
      description="Trường học, chuyên ngành và tình trạng học tập hiển thị trong phần giới thiệu."
    >
      <AcademicFields />
    </ProfileSectionDialog>
  );
}
