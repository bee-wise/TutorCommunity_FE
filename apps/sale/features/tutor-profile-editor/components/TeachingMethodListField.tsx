"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { ProfileField } from "./ProfileField";
import { RepeaterError, RepeaterHeader, RepeaterItem } from "./RepeaterPrimitives";

export function TeachingMethodListField() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "teachingMethods",
  });

  return (
    <div className="grid gap-3">
      <RepeaterHeader
        label="Phương pháp giảng dạy"
        description="Mỗi phương pháp gồm tên ngắn gọn và phần mô tả riêng."
        addLabel="Thêm phương pháp"
        reviewRequired
        onAdd={() => append({ title: "", description: "" })}
        canAdd={fields.length < 5}
      />
      <div className="grid gap-3">
        {fields.map((field, index) => (
          <RepeaterItem
            key={field.id}
            title={`Phương pháp ${index + 1}`}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          >
            <div className="grid gap-4">
              <ProfileField
                id={`teaching-method-${field.id}-title`}
                label="Tên phương pháp"
                error={errors.teachingMethods?.[index]?.title}
                registration={register(`teachingMethods.${index}.title`)}
              />
              <ProfileField
                id={`teaching-method-${field.id}-description`}
                label="Mô tả"
                error={errors.teachingMethods?.[index]?.description}
                registration={register(`teachingMethods.${index}.description`)}
                multiline
                rows={3}
              />
            </div>
          </RepeaterItem>
        ))}
      </div>
      <RepeaterError message={errors.teachingMethods?.root?.message} />
    </div>
  );
}
