"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import {
  RepeaterError,
  RepeaterHeader,
  RepeaterItem,
} from "../RepeaterPrimitives";

function ExperienceFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "teachingHistory",
  });

  return (
    <div className="grid gap-4">
      <RepeaterHeader
        label="Kinh nghiệm giảng dạy"
        description="Mỗi kinh nghiệm được trình bày thành một mục công khai riêng."
        addLabel="Thêm kinh nghiệm"
        reviewRequired
        onAdd={() =>
          append({ title: "", detail: "", outcome: "Chờ xác minh" })
        }
      />
      {fields.map((field, index) => (
        <RepeaterItem
          key={field.id}
          title={`Kinh nghiệm ${index + 1}`}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        >
          <div className="grid gap-4">
            <ProfileField
              id={`teaching-history-${index}-title`}
              label="Tên kinh nghiệm"
              error={errors.teachingHistory?.[index]?.title}
              registration={register(`teachingHistory.${index}.title`)}
            />
            <ProfileField
              id={`teaching-history-${index}-detail`}
              label="Mô tả công khai"
              error={errors.teachingHistory?.[index]?.detail}
              registration={register(`teachingHistory.${index}.detail`)}
              multiline
              rows={3}
            />
            <div className="rounded-xl border border-[#cfe1fa] bg-white px-3 py-3">
              <p className="text-xs font-bold text-[#56516a]">Trạng thái</p>
              <p className="mt-1 text-sm font-extrabold text-[#17142f]">
                {field.outcome}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#716c83]">
                BeeWise cập nhật trạng thái sau khi kiểm tra thông tin.
              </p>
            </div>
          </div>
        </RepeaterItem>
      ))}
      <RepeaterError message={errors.teachingHistory?.root?.message} />
    </div>
  );
}

export function ExperienceEditDialog({
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
      title="Chỉnh sửa kinh nghiệm"
      description="Bổ sung các hoạt động giảng dạy. Trạng thái xác minh do hệ thống quản lý."
      profile={profile}
      onClose={onClose}
      onSave={onSave}
    >
      <ExperienceFields />
    </ProfileBlockDialog>
  );
}
