"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  ProfileField,
  profileTextareaClass,
} from "../../../tutor-profile-registration/components/ProfileField";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["introduction"] as const;

function IntroductionFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const length = (useWatch({ control, name: "introduction" }) ?? "").length;

  return (
    <ProfileField
      label="Giới thiệu chi tiết"
      required
      error={errors.introduction?.message}
      hint="Tối thiểu 80 ký tự. Tách đoạn bằng một dòng trống để dễ đọc hơn."
    >
      <textarea
        {...register("introduction")}
        rows={12}
        className={`${profileTextareaClass} min-h-64`}
        placeholder="Chia sẻ kinh nghiệm, cách bạn xây dựng lộ trình và kết quả từng đạt được..."
      />
      <span className="text-right text-xs font-normal text-muted-foreground">{length}/2000</span>
    </ProfileField>
  );
}

export function IntroductionDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      fields={FIELDS}
      title="Chỉnh sửa giới thiệu"
      description="Giúp học viên và phụ huynh hiểu phong cách giảng dạy của bạn."
    >
      <IntroductionFields />
    </ProfileSectionDialog>
  );
}
