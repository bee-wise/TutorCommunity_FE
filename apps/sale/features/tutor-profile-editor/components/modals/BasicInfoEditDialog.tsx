"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { TEACHING_MODE_OPTIONS } from "../../constants/profile-editor.options";
import { isLocalPreviewUrl, validatePreviewFile } from "../../utils/file-preview";
import { AvailabilityListField } from "../AvailabilityListField";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import { SimpleListField } from "../SimpleListField";

const imageRule = {
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * 1024 * 1024,
};

function BasicInfoFields({
  profile,
  avatarUrl,
  fileError,
  onFileChange,
}: {
  profile: TutorProfileEditorValues;
  avatarUrl: string;
  fileError: string | null;
  onFileChange: (file?: File) => void;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();

  return (
    <>
      <div className="grid gap-4 rounded-xl border border-[#dce7f7] bg-[#f7f9fd] p-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center">
        <div className="relative aspect-square w-28 overflow-hidden rounded-2xl border border-[#cfe1fa] bg-white">
          <Image
            src={avatarUrl}
            alt={`Xem trước ảnh đại diện của ${profile.displayName}`}
            fill
            unoptimized={isLocalPreviewUrl(avatarUrl)}
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div>
          <label htmlFor="avatar-file" className="text-sm font-bold text-[#17142f]">
            Ảnh đại diện
          </label>
          <p className="mt-1 text-xs leading-5 text-[#56516a]">
            JPG, PNG hoặc WEBP. Dung lượng tối đa 5 MB.
          </p>
          <input
            id="avatar-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => onFileChange(event.target.files?.[0])}
            className="mt-3 block w-full text-xs text-[#56516a] file:mr-3 file:rounded-full file:border-0 file:bg-[#280f91] file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-[#200c76]"
          />
          {fileError ? <p role="alert" className="mt-2 text-xs font-semibold text-[#9f2017]">{fileError}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-[#cfe1fa] bg-[#f7f9fd] p-4">
        <p className="text-xs font-bold text-[#56516a]">Tên hiển thị</p>
        <p className="mt-1 text-sm font-extrabold text-[#17142f]">{profile.displayName}</p>
        <p className="mt-1 text-xs leading-5 text-[#716c83]">Thông tin tài khoản được đồng bộ từ hệ thống và không chỉnh sửa tại đây.</p>
      </div>

      <ProfileField id="headline" label="Tiêu đề hồ sơ" reviewRequired error={errors.headline} registration={register("headline")} />
      <ProfileField id="shortIntro" label="Giới thiệu ngắn" reviewRequired error={errors.shortIntro} registration={register("shortIntro")} multiline rows={3} />
      <SimpleListField name="subjects" label="Môn giảng dạy" itemLabel="Môn học" addLabel="Thêm môn" reviewRequired />
      <SimpleListField name="specializations" label="Chuyên môn nổi bật" itemLabel="Chuyên môn" addLabel="Thêm chuyên môn" reviewRequired />
      <ProfileField
        id="teaching-mode"
        label="Hình thức dạy"
        error={errors.teachingModes?.[0]?.value}
        registration={register("teachingModes.0.value")}
        options={TEACHING_MODE_OPTIONS}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField id="area" label="Khu vực dạy" error={errors.area} registration={register("area")} />
        <ProfileField id="hourlyRate" label="Học phí" reviewRequired error={errors.hourlyRate} registration={register("hourlyRate")} />
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
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [fileError, setFileError] = useState<string | null>(null);
  const generatedUrl = useRef<string | null>(null);
  const committed = useRef(false);

  useEffect(() => () => {
    if (!committed.current && generatedUrl.current) URL.revokeObjectURL(generatedUrl.current);
  }, []);

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const error = validatePreviewFile(file, imageRule);
    setFileError(error);
    if (error) return;
    if (generatedUrl.current) URL.revokeObjectURL(generatedUrl.current);
    generatedUrl.current = URL.createObjectURL(file);
    setAvatarUrl(generatedUrl.current);
  };

  return (
    <ProfileBlockDialog
      open
      title="Chỉnh sửa thông tin cơ bản"
      description="Cập nhật phần tổng quan mà học viên nhìn thấy đầu tiên."
      profile={profile}
      onClose={onClose}
      onSave={(values) => {
        committed.current = true;
        onSave({ ...values, avatarUrl });
      }}
    >
      <BasicInfoFields profile={profile} avatarUrl={avatarUrl} fileError={fileError} onFileChange={handleFileChange} />
    </ProfileBlockDialog>
  );
}
