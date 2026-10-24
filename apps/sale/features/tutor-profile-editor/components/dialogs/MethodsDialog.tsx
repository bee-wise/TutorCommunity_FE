"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  ProfileField,
  profileInputClass,
  profileTextareaClass,
} from "../../../tutor-profile-registration/components/ProfileField";
import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["teachingMethods"] as const;

function MethodsFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const methods = useFieldArray({ control, name: "teachingMethods", keyName: "fieldKey" });

  return (
    <div className="space-y-4">
      {methods.fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Chưa có phương pháp giảng dạy nào. Mục này không bắt buộc.
        </div>
      ) : null}
      {methods.fields.map((item, index) => (
        <div key={item.fieldKey} className="space-y-4 rounded-xl border border-[#dce7f7] bg-[#fbfcff] p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-[#17142f]">Phương pháp {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => methods.remove(index)}
              className="text-destructive"
              aria-label={`Xóa phương pháp ${index + 1}`}
            >
              <Trash aria-hidden="true" /> Xóa
            </Button>
          </div>
          <ProfileField label="Tên phương pháp" required error={errors.teachingMethods?.[index]?.title?.message}>
            <input
              {...register(`teachingMethods.${index}.title`)}
              className={profileInputClass}
              placeholder="Ví dụ: Học qua tình huống thực tế"
            />
          </ProfileField>
          <ProfileField label="Mô tả" required error={errors.teachingMethods?.[index]?.description?.message}>
            <textarea
              {...register(`teachingMethods.${index}.description`)}
              rows={3}
              className={profileTextareaClass}
              placeholder="Mô tả cách bạn áp dụng phương pháp này trong buổi học..."
            />
          </ProfileField>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => methods.append({ title: "", description: "" })}
        className="h-11 w-full rounded-xl border-dashed"
      >
        <Plus aria-hidden="true" /> Thêm phương pháp
      </Button>
    </div>
  );
}

export function MethodsDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      fields={FIELDS}
      title="Chỉnh sửa phương pháp giảng dạy"
      description="Thêm các phương pháp đặc trưng giúp học viên hình dung buổi học."
    >
      <MethodsFields />
    </ProfileSectionDialog>
  );
}
