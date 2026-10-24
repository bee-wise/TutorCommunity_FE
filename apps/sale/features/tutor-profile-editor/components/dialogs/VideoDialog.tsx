"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FileUploadField } from "../../../tutor-profile-registration/components/FileUploadField";
import { ProfileField } from "../../../tutor-profile-registration/components/ProfileField";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["videoUrl"] as const;

function VideoFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  return (
    <ProfileField
      label="Video giới thiệu"
      interactive
      error={errors.videoUrl?.message}
      hint="MP4, WebM hoặc MOV, tối đa 100 MB."
    >
      <Controller
        control={control}
        name="videoUrl"
        render={({ field }) => (
          <FileUploadField value={field.value} folder="intro-videos" kind="video" onChange={field.onChange} />
        )}
      />
    </ProfileField>
  );
}

export function VideoDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      size="md"
      fields={FIELDS}
      title="Chỉnh sửa video giới thiệu"
      description="Video ngắn giúp học viên hiểu cách bạn truyền đạt."
    >
      <VideoFields />
    </ProfileSectionDialog>
  );
}
