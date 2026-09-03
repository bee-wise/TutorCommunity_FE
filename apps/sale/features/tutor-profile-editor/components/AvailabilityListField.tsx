"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { ProfileField } from "./ProfileField";
import { RepeaterError, RepeaterHeader, RepeaterItem } from "./RepeaterPrimitives";

const DAY_OPTIONS = [
  { value: "Thứ 2", label: "Thứ 2" },
  { value: "Thứ 3", label: "Thứ 3" },
  { value: "Thứ 4", label: "Thứ 4" },
  { value: "Thứ 5", label: "Thứ 5" },
  { value: "Thứ 6", label: "Thứ 6" },
  { value: "Thứ 7", label: "Thứ 7" },
  { value: "Chủ nhật", label: "Chủ nhật" },
];

export function AvailabilityListField() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  return (
    <div className="grid gap-3">
      <RepeaterHeader
        label="Lịch rảnh dự kiến"
        description="Tách riêng ngày dạy và khung giờ để học viên dễ theo dõi."
        addLabel="Thêm lịch rảnh"
        onAdd={() => append({ day: "", time: "" })}
        canAdd={fields.length < 10}
      />
      <div className="grid gap-3">
        {fields.map((field, index) => (
          <RepeaterItem
            key={field.id}
            title={`Lịch rảnh ${index + 1}`}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField
                id={`availability-${field.id}-day`}
                label="Ngày dạy"
                error={errors.availability?.[index]?.day}
                registration={register(`availability.${index}.day`)}
                options={DAY_OPTIONS}
              />
              <ProfileField
                id={`availability-${field.id}-time`}
                label="Khung giờ"
                error={errors.availability?.[index]?.time}
                registration={register(`availability.${index}.time`)}
                placeholder="Ví dụ: 19:00 - 21:00"
              />
            </div>
          </RepeaterItem>
        ))}
      </div>
      <RepeaterError message={errors.availability?.root?.message} />
    </div>
  );
}
