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

const FIELDS = ["experienceYears", "teachingHistory"] as const;

function ExperienceFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const history = useFieldArray({ control, name: "teachingHistory", keyName: "fieldKey" });

  return (
    <>
      <ProfileField label="Số năm kinh nghiệm" required error={errors.experienceYears?.message}>
        <input
          {...register("experienceYears", { valueAsNumber: true })}
          type="number"
          min={0}
          max={99}
          className={`${profileInputClass} sm:max-w-48`}
        />
      </ProfileField>

      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-[#17142f]">Kinh nghiệm giảng dạy</h3>
        {history.fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Chưa có kinh nghiệm nào. Mục này không bắt buộc.
          </div>
        ) : null}
        {history.fields.map((item, index) => {
          const itemErrors = errors.teachingHistory?.[index];
          return (
            <div key={item.fieldKey} className="space-y-4 rounded-xl border border-[#dce7f7] bg-[#fbfcff] p-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-extrabold text-[#17142f]">Kinh nghiệm {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => history.remove(index)}
                  className="text-destructive"
                  aria-label={`Xóa kinh nghiệm ${index + 1}`}
                >
                  <Trash aria-hidden="true" /> Xóa
                </Button>
              </div>
              <div className="grid items-start gap-4 sm:grid-cols-2">
                <ProfileField label="Vai trò / môn giảng dạy" required error={itemErrors?.title?.message}>
                  <input {...register(`teachingHistory.${index}.title`)} className={profileInputClass} placeholder="Gia sư Toán lớp 9" />
                </ProfileField>
                <ProfileField label="Đơn vị giảng dạy" required error={itemErrors?.organization?.message}>
                  <input {...register(`teachingHistory.${index}.organization`)} className={profileInputClass} placeholder="Trung tâm / học viên cá nhân" />
                </ProfileField>
                <ProfileField label="Ngày bắt đầu">
                  <input {...register(`teachingHistory.${index}.startDate`)} type="date" className={profileInputClass} />
                </ProfileField>
                <ProfileField label="Ngày kết thúc">
                  <input {...register(`teachingHistory.${index}.endDate`)} type="date" className={profileInputClass} />
                </ProfileField>
              </div>
              <ProfileField label="Mô tả công việc" required error={itemErrors?.detail?.message}>
                <textarea
                  {...register(`teachingHistory.${index}.detail`)}
                  rows={3}
                  className={profileTextareaClass}
                  placeholder="Mô tả công việc và đối tượng học viên..."
                />
              </ProfileField>
              <ProfileField label="Kết quả nổi bật">
                <input {...register(`teachingHistory.${index}.outcome`)} className={profileInputClass} placeholder="Ví dụ: Điểm Toán tăng từ 6 lên 8" />
              </ProfileField>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <input type="checkbox" {...register(`teachingHistory.${index}.isCurrent`)} className="size-4" />
                Hiện vẫn đang giảng dạy
              </label>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            history.append({
              id: "",
              title: "",
              organization: "",
              detail: "",
              outcome: "",
              startDate: "",
              endDate: "",
              isCurrent: false,
            })
          }
          className="h-11 w-full rounded-xl border-dashed"
        >
          <Plus aria-hidden="true" /> Thêm kinh nghiệm
        </Button>
      </div>
    </>
  );
}

export function ExperienceDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      fields={FIELDS}
      title="Chỉnh sửa kinh nghiệm"
      description="Các lớp học, trung tâm hoặc hoạt động kèm học bạn đã tham gia."
    >
      <ExperienceFields />
    </ProfileSectionDialog>
  );
}
