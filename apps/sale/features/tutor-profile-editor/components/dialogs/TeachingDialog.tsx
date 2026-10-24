"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CatalogSelect } from "../../../tutor-profile-registration/components/CatalogSelect";
import { ProfileField } from "../../../tutor-profile-registration/components/ProfileField";
import { TeachingAreaFields } from "../../../tutor-profile-registration/components/TeachingAreaFields";
import { TeachingOfferingsFields } from "../../../tutor-profile-registration/components/TeachingOfferingsFields";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = [
  "teachingOfferings",
  "teachingModes",
  "specializationIds",
  "area",
  "offlineCity",
  "offlineDistrict",
  "offlineWard",
  "offlineAddressDetail",
  "travelRadiusKm",
] as const;

function TeachingFields() {
  const { control, watch } = useFormContext<TutorProfileFormValues>();
  const requiresArea = watch("teachingModes").includes("OFFLINE");

  return (
    <>
      <TeachingOfferingsFields />
      <ProfileField label="Chuyên môn nổi bật" interactive hint="Có thể chọn nhiều.">
        <Controller
          control={control}
          name="specializationIds"
          render={({ field }) => (
            <CatalogSelect
              resource="specializations"
              multiple
              value={field.value}
              onChange={field.onChange}
              placeholder="Tìm chuyên môn..."
            />
          )}
        />
      </ProfileField>
      <TeachingAreaFields required={requiresArea} />
    </>
  );
}

export function TeachingDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      fields={FIELDS}
      title="Chỉnh sửa môn dạy, học phí và khu vực"
      description="Mỗi tổ hợp gồm chương trình, môn, cấp học và học phí riêng. Thay đổi học phí cần được duyệt lại."
    >
      <TeachingFields />
    </ProfileSectionDialog>
  );
}
