"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FileUploadField } from "../../../tutor-profile-registration/components/FileUploadField";
import {
  ProfileField,
  profileInputClass,
  profileTextareaClass,
} from "../../../tutor-profile-registration/components/ProfileField";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["avatarUrl", "displayName", "headline", "shortIntro"] as const;

function CharacterCount({ name, max }: { name: "headline" | "shortIntro"; max: number }) {
  const { control } = useFormContext<TutorProfileFormValues>();
  const value = useWatch({ control, name }) ?? "";
  return (
    <span className="text-right text-xs font-normal text-muted-foreground">
      {value.length}/{max}
    </span>
  );
}

function BasicInfoFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();

  return (
    <>
      <ProfileField
        label="Ảnh đại diện"
        required
        interactive
        error={errors.avatarUrl?.message}
        hint="Ảnh vuông, rõ khuôn mặt và có ánh sáng tốt."
      >
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <FileUploadField value={field.value} folder="avatars" onChange={field.onChange} />
          )}
        />
      </ProfileField>
      <ProfileField label="Tên hiển thị" required error={errors.displayName?.message}>
        <input {...register("displayName")} className={profileInputClass} placeholder="Nguyễn Minh Anh" />
      </ProfileField>
      <ProfileField label="Tiêu đề hồ sơ" required error={errors.headline?.message}>
        <input
          {...register("headline")}
          className={profileInputClass}
          placeholder="Gia sư Toán THPT giúp học sinh lấy lại nền tảng"
        />
        <CharacterCount name="headline" max={120} />
      </ProfileField>
      <ProfileField label="Giới thiệu ngắn" required error={errors.shortIntro?.message}>
        <textarea
          {...register("shortIntro")}
          rows={4}
          className={profileTextareaClass}
          placeholder="Tóm tắt điểm mạnh và đối tượng học viên phù hợp..."
        />
        <CharacterCount name="shortIntro" max={240} />
      </ProfileField>
    </>
  );
}

export function BasicInfoDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      size="md"
      fields={FIELDS}
      title="Chỉnh sửa thông tin cơ bản"
      description="Phần tổng quan học viên nhìn thấy đầu tiên trên hồ sơ của bạn."
    >
      <BasicInfoFields />
    </ProfileSectionDialog>
  );
}
