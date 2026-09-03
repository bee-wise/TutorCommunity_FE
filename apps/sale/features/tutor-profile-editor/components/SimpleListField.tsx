"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { ProfileField } from "./ProfileField";
import { RepeaterError, RepeaterHeader, RepeaterItem } from "./RepeaterPrimitives";

type SimpleListName =
  | "subjects"
  | "specializations"
  | "teachingModes"
  | "introduction"
  | "education"
  | "achievements";

interface SimpleListFieldProps {
  name: SimpleListName;
  label: string;
  itemLabel: string;
  addLabel: string;
  description?: string;
  reviewRequired?: boolean;
  multiline?: boolean;
}

export function SimpleListField({
  name,
  label,
  itemLabel,
  addLabel,
  description,
  reviewRequired = false,
  multiline = false,
}: SimpleListFieldProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({ control, name });
  const fieldErrors = errors[name];

  return (
    <div className="grid gap-3">
      <RepeaterHeader
        label={label}
        description={description}
        addLabel={addLabel}
        reviewRequired={reviewRequired}
        onAdd={() => append({ value: "" })}
        canAdd={fields.length < 10}
      />
      <div className="grid gap-3">
        {fields.map((field, index) => (
          <RepeaterItem
            key={field.id}
            title={`${itemLabel} ${index + 1}`}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          >
            <ProfileField
              id={`${name}-${field.id}`}
              label={itemLabel}
              error={fieldErrors?.[index]?.value}
              registration={register(`${name}.${index}.value`)}
              multiline={multiline}
              rows={multiline ? 3 : undefined}
            />
          </RepeaterItem>
        ))}
      </div>
      <RepeaterError message={fieldErrors?.root?.message} />
    </div>
  );
}
