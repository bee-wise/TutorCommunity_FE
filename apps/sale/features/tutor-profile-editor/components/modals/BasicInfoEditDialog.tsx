"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { TEACHING_MODE_OPTIONS } from "../../constants/profile-editor.options";
import { FileUploadField } from "../../../tutor-profile-registration/components/FileUploadField";
import { CatalogSelect } from "../../../tutor-profile-registration/components/CatalogSelect";
import { AvailabilityListField } from "../AvailabilityListField";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import { SimpleListField } from "../SimpleListField";

function BasicInfoFields({
  profile,
}: {
  profile: TutorProfileEditorValues;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();

  return (
    <>
      <div className="space-y-2 rounded-2xl border border-[#cfe1fa] bg-[#f7f9fd] p-4">
        <label className="text-sm font-bold text-[#17142f]">
          Ảnh đại diện <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-[#56516a]">
          Ảnh vuông, rõ khuôn mặt và có ánh sáng tốt (tối đa 5 MB).
        </p>
        <div className="pt-1">
          <Controller
            control={control}
            name="avatarUrl"
            render={({ field }) => (
              <FileUploadField
                value={field.value}
                folder="avatars"
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#cfe1fa] bg-[#f7f9fd] p-4">
        <p className="text-xs font-bold text-[#56516a]">Tên hiển thị</p>
        <p className="mt-1 text-sm font-extrabold text-[#17142f]">
          {profile.displayName}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#716c83]">
          Thông tin tài khoản được đồng bộ từ hệ thống và không chỉnh sửa tại
          đây.
        </p>
      </div>

      <ProfileField
        id="headline"
        label="Tiêu đề hồ sơ"
        reviewRequired
        error={errors.headline}
        registration={register("headline")}
      />
      <ProfileField
        id="shortIntro"
        label="Giới thiệu ngắn"
        reviewRequired
        error={errors.shortIntro}
        registration={register("shortIntro")}
        multiline
        rows={3}
      />
      <SimpleListField
        name="subjects"
        label="Môn giảng dạy"
        itemLabel="Môn học"
        addLabel="Thêm môn"
        reviewRequired
      />
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#17142f]">
          Chuyên môn nổi bật
        </label>
        <Controller
          control={control}
          name="specializations"
          render={({ field }) => {
            const raw = field.value ?? [];
            const stringValues = raw
              .map((item: unknown) => {
                if (typeof item === "string") return item;
                if (item && typeof item === "object" && "value" in item) {
                  return String((item as { value: unknown }).value || "");
                }
                return "";
              })
              .filter(Boolean);
            return (
              <CatalogSelect
                resource="specializations"
                multiple
                valueMode="name"
                value={stringValues}
                onChange={(next: string | string[]) => {
                  const arr = Array.isArray(next) ? next : [next];
                  field.onChange(arr.map((val) => ({ value: val })));
                }}
                placeholder="Tìm chuyên môn..."
              />
            );
          }}
        />
        {errors.specializations && (
          <p className="text-xs font-medium text-red-600">
            {errors.specializations.message}
          </p>
        )}
      </div>

      <ProfileField
        id="teaching-mode"
        label="Hình thức dạy"
        error={errors.teachingModes?.[0]?.value}
        registration={register("teachingModes.0.value")}
        options={TEACHING_MODE_OPTIONS}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField
          id="area"
          label="Khu vực dạy"
          error={errors.area}
          registration={register("area")}
        />
        <ProfileField
          id="hourlyRate"
          label="Học phí"
          reviewRequired
          error={errors.hourlyRate}
          registration={register("hourlyRate")}
        />
      </div>
      <AvailabilityListField />
    </>
  );
}

export function BasicInfoEditDialog({
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
      title="Chỉnh sửa thông tin cơ bản"
      description="Cập nhật phần tổng quan mà học viên nhìn thấy đầu tiên."
      profile={profile}
      onClose={onClose}
      onSave={onSave}
    >
      <BasicInfoFields profile={profile} />
    </ProfileBlockDialog>
  );
}
