"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Medal, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";
import { FileUploadField } from "./FileUploadField";
import { ProfileSelect } from "./ProfileSelect";
import {
  ProfileField,
  profileInputClass,
  profileTextareaClass,
} from "./ProfileField";

export function AchievementsFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const achievements = useFieldArray({
    control,
    name: "achievements",
    keyName: "fieldKey",
  });

  return (
    <section className="space-y-4 border-t border-border pt-6" aria-labelledby="achievements-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="achievements-heading" className="text-lg font-bold text-foreground">
            Thành tích và chứng chỉ
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Bổ sung giải thưởng, chứng chỉ hoặc thành tích học thuật để học viên hiểu rõ năng lực của bạn.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            achievements.append({
              id: "",
              type: "CERTIFICATE",
              title: "",
              issuer: "",
              score: "",
              startDate: "",
              endDate: "",
              imageUrl: "",
              description: "",
            })
          }
        >
          <Plus aria-hidden="true" /> Thêm thành tích
        </Button>
      </div>

      {achievements.fields.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <Medal className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-6 text-muted-foreground">
            Chưa có thành tích nào. Mục này không bắt buộc; bạn có thể bổ sung sau.
          </p>
        </div>
      ) : null}

      {achievements.fields.map((item, index) => (
        <div key={item.fieldKey} className="space-y-4 rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-foreground">Thành tích {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => achievements.remove(index)}
              className="text-destructive"
              aria-label={`Xóa thành tích ${index + 1}`}
            >
              <Trash aria-hidden="true" /> Xóa
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Loại thành tích" required error={errors.achievements?.[index]?.type?.message} interactive>
              <Controller control={control} name={`achievements.${index}.type`} render={({ field }) => (
                <ProfileSelect
                  label={`Loại thành tích ${index + 1}`}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Chọn loại thành tích"
                  invalid={Boolean(errors.achievements?.[index]?.type)}
                  options={[
                    { value: "CERTIFICATE", label: "Chứng chỉ" },
                    { value: "AWARD", label: "Giải thưởng" },
                    { value: "ACADEMIC", label: "Học thuật" },
                  ]}
                />
              )} />
            </ProfileField>
            <ProfileField label="Tên thành tích" required error={errors.achievements?.[index]?.title?.message}>
              <input
                {...register(`achievements.${index}.title`)}
                className={profileInputClass}
                placeholder="Ví dụ: IELTS 8.0, Giải Nhất Toán"
              />
            </ProfileField>
            <ProfileField label="Đơn vị cấp" required error={errors.achievements?.[index]?.issuer?.message}>
              <input
                {...register(`achievements.${index}.issuer`)}
                className={profileInputClass}
                placeholder="Tổ chức hoặc đơn vị cấp"
              />
            </ProfileField>
            <ProfileField label="Điểm / xếp loại">
              <input
                {...register(`achievements.${index}.score`)}
                className={profileInputClass}
                placeholder="Nếu có"
              />
            </ProfileField>
            <ProfileField label="Ngày bắt đầu">
              <input {...register(`achievements.${index}.startDate`)} type="date" className={profileInputClass} />
            </ProfileField>
            <ProfileField label="Ngày kết thúc">
              <input {...register(`achievements.${index}.endDate`)} type="date" className={profileInputClass} />
            </ProfileField>
          </div>
          <ProfileField label="Mô tả">
            <textarea
              {...register(`achievements.${index}.description`)}
              className={profileTextareaClass}
              placeholder="Mô tả ngắn về thành tích này..."
            />
          </ProfileField>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Ảnh minh chứng</p>
            <Controller
              control={control}
              name={`achievements.${index}.imageUrl`}
              render={({ field }) => (
                <FileUploadField
                  value={field.value}
                  folder="certificates"
                  onChange={field.onChange}
                />
              )}
            />
            {errors.achievements?.[index]?.imageUrl?.message ? (
              <p className="text-xs font-medium text-destructive">
                {errors.achievements[index].imageUrl.message}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
