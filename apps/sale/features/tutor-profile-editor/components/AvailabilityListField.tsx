"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { AvailabilityTimeRangeField } from "../../tutor-profile-registration/components/AvailabilityTimeRangeField";
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
        description="Tách riêng ngày dạy và khung giờ theo bước 30 phút để học viên dễ theo dõi."
        addLabel="Thêm lịch rảnh"
        onAdd={() => append({ day: "Thứ 2", time: "18:00 - 20:00" })}
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
            <div className="grid gap-4 md:grid-cols-2 md:items-start">
              <ProfileField
                id={`availability-${field.id}-day`}
                label="Ngày dạy"
                error={errors.availability?.[index]?.day}
                registration={register(`availability.${index}.day`)}
                options={DAY_OPTIONS}
              />
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#56516a]">
                  Khung giờ dạy
                </span>
                <Controller
                  control={control}
                  name={`availability.${index}.time`}
                  render={({ field: timeField }) => (
                    <AvailabilityTimeRangeField
                      value={timeField.value}
                      error={errors.availability?.[index]?.time?.message}
                      onChange={timeField.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </RepeaterItem>
        ))}
      </div>
      <RepeaterError message={errors.availability?.root?.message} />
    </div>
  );
}
