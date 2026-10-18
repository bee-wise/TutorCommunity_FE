"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { FileUploadField } from "../../../tutor-profile-registration/components/FileUploadField";
import { ProfileSelect } from "../../../tutor-profile-registration/components/ProfileSelect";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import {
  RepeaterError,
  RepeaterHeader,
  RepeaterItem,
} from "../RepeaterPrimitives";

const ACHIEVEMENT_TYPE_OPTIONS = [
  { value: "CERTIFICATE", label: "Chứng chỉ" },
  { value: "DIPLOMA", label: "Bằng cấp" },
  { value: "COMPETITION", label: "Giải thưởng / cuộc thi" },
  { value: "OTHER", label: "Khác" },
];

function EvidenceFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates",
  });

  return (
    <div className="grid gap-4">
      <RepeaterHeader
        label="Minh chứng"
        description="Tải ảnh và mô tả từng minh chứng. Trạng thái xét duyệt do BeeWise kiểm tra."
        addLabel="Thêm minh chứng"
        reviewRequired
        onAdd={() =>
          append({
            title: "",
            type: "CERTIFICATE",
            issuer: "",
            score: "",
            startDate: "",
            endDate: "",
            imageUrl: "",
            status: "Chờ xác minh",
            description: "",
          })
        }
      />
      {fields.map((field, index) => (
        <RepeaterItem
          key={field.id}
          title={`Minh chứng ${index + 1}`}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#56516a]">
                Ảnh chụp minh chứng <span className="text-red-500">*</span>
              </span>
              <Controller
                control={control}
                name={`certificates.${index}.imageUrl`}
                render={({ field: imageField }) => (
                  <FileUploadField
                    value={imageField.value}
                    folder="documents"
                    onChange={imageField.onChange}
                  />
                )}
              />
              {errors.certificates?.[index]?.imageUrl && (
                <p className="text-xs font-medium text-red-600">
                  {errors.certificates[index]?.imageUrl?.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#56516a]">
                  Loại minh chứng
                </span>
                <Controller
                  control={control}
                  name={`certificates.${index}.type`}
                  render={({ field: typeField }) => (
                    <ProfileSelect
                      label="Loại minh chứng"
                      value={typeField.value}
                      onChange={typeField.onChange}
                      options={ACHIEVEMENT_TYPE_OPTIONS}
                      placeholder="Chọn loại"
                    />
                  )}
                />
              </div>
              <ProfileField
                id={`certificate-${index}-title`}
                label="Tên minh chứng"
                error={errors.certificates?.[index]?.title}
                registration={register(`certificates.${index}.title`)}
                placeholder="Ví dụ: IELTS 8.0, Giải Nhất Toán"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                id={`certificate-${index}-issuer`}
                label="Đơn vị cấp"
                error={errors.certificates?.[index]?.issuer as { message?: string } | undefined}
                registration={register(`certificates.${index}.issuer`)}
                placeholder="Tổ chức hoặc đơn vị cấp"
              />
              <ProfileField
                id={`certificate-${index}-score`}
                label="Điểm / xếp loại"
                error={errors.certificates?.[index]?.score as { message?: string } | undefined}
                registration={register(`certificates.${index}.score`)}
                placeholder="Nếu có (ví dụ: 8.0, Giỏi...)"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                id={`certificate-${index}-startDate`}
                label="Ngày bắt đầu"
                type="date"
                error={errors.certificates?.[index]?.startDate as { message?: string } | undefined}
                registration={register(`certificates.${index}.startDate`)}
              />
              <ProfileField
                id={`certificate-${index}-endDate`}
                label="Ngày kết thúc"
                type="date"
                error={errors.certificates?.[index]?.endDate as { message?: string } | undefined}
                registration={register(`certificates.${index}.endDate`)}
              />
            </div>

            <div className="rounded-xl border border-[#cfe1fa] bg-[#f7f9fd] px-3.5 py-3">
              <p className="text-xs font-bold text-[#56516a]">
                Trạng thái xác minh
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#17142f]">
                {field.status || "Chờ xác minh"}
              </p>
              <p className="mt-0.5 text-xs text-[#716c83]">
                Trạng thái do BeeWise cập nhật sau khi xét duyệt hồ sơ.
              </p>
            </div>

            <ProfileField
              id={`certificate-${index}-description`}
              label="Mô tả công khai"
              error={errors.certificates?.[index]?.description}
              registration={register(`certificates.${index}.description`)}
              multiline
              rows={3}
              placeholder="Mô tả ngắn gọn về kỹ năng hoặc thành tích đạt được..."
            />
          </div>
        </RepeaterItem>
      ))}
      <RepeaterError message={errors.certificates?.root?.message} />
    </div>
  );
}

export function EvidenceEditDialog({
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
      title="Chỉnh sửa minh chứng"
      description="Tải ảnh và mô tả từng minh chứng. Trạng thái xét duyệt không thể chỉnh sửa."
      profile={profile}
      onClose={onClose}
      onSave={onSave}
    >
      <EvidenceFields />
    </ProfileBlockDialog>
  );
}
