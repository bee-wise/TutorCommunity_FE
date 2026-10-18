"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
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
  const teachingHistoryValues = useWatch({ control, name: "teachingHistory" });

  return (
    <div className="grid gap-4">
      <RepeaterHeader
        label="Kinh nghiệm giảng dạy"
        description="Thêm lớp học, trung tâm hoặc hoạt động kèm học trước đây để học viên hiểu rõ kinh nghiệm của bạn."
        addLabel="Thêm kinh nghiệm"
        reviewRequired
        onAdd={() =>
          append({
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            detail: "",
            outcome: "Đạt mục tiêu",
          })
        }
      />
      {fields.map((field, index) => {
        const isCurrent = teachingHistoryValues?.[index]?.isCurrent ?? false;
        return (
          <RepeaterItem
            key={field.id}
            title={`Kinh nghiệm ${index + 1}`}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  id={`teaching-history-${index}-title`}
                  label="Vai trò / môn giảng dạy"
                  error={errors.teachingHistory?.[index]?.title}
                  registration={register(`teachingHistory.${index}.title`)}
                  placeholder="Ví dụ: Gia sư Toán 1:1, Trợ giảng môn Lý"
                />
                <ProfileField
                  id={`teaching-history-${index}-org`}
                  label="Tổ chức / Đơn vị"
                  error={
                    errors.teachingHistory?.[index]?.organization as
                      | { message?: string }
                      | undefined
                  }
                  registration={register(
                    `teachingHistory.${index}.organization`,
                  )}
                  placeholder="Trung tâm / đơn vị / học viên cá nhân"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  id={`teaching-history-${index}-start`}
                  label="Ngày bắt đầu"
                  error={
                    errors.teachingHistory?.[index]?.startDate as
                      | { message?: string }
                      | undefined
                  }
                  registration={register(`teachingHistory.${index}.startDate`)}
                  type="date"
                />
                <ProfileField
                  id={`teaching-history-${index}-end`}
                  label="Ngày kết thúc"
                  disabled={isCurrent}
                  error={
                    errors.teachingHistory?.[index]?.endDate as
                      | { message?: string }
                      | undefined
                  }
                  registration={register(`teachingHistory.${index}.endDate`)}
                  type="date"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#17142f]">
                <input
                  type="checkbox"
                  {...register(`teachingHistory.${index}.isCurrent`)}
                  className="rounded border-[#cfe1fa] text-primary focus:ring-primary"
                />
                Hiện vẫn đang tham gia giảng dạy lớp này
              </label>

              <ProfileField
                id={`teaching-history-${index}-detail`}
                label="Mô tả công việc và học viên"
                error={errors.teachingHistory?.[index]?.detail}
                registration={register(`teachingHistory.${index}.detail`)}
                multiline
                rows={3}
                placeholder="Mô tả đối tượng học viên, phương pháp áp dụng và tiến độ học tập..."
              />

              <ProfileField
                id={`teaching-history-${index}-outcome`}
                label="Kết quả nổi bật"
                error={
                  errors.teachingHistory?.[index]?.outcome as
                    | { message?: string }
                    | undefined
                }
                registration={register(`teachingHistory.${index}.outcome`)}
                placeholder="Ví dụ: 100% học sinh đạt điểm 8+ trong kỳ thi cuối kỳ"
              />
            </div>
          </RepeaterItem>
        );
      })}
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
      description="Bổ sung các hoạt động giảng dạy. Thông tin được công khai để học viên tham khảo."
      profile={profile}
      onClose={onClose}
      onSave={onSave}
    >
      <ExperienceFields />
    </ProfileBlockDialog>
  );
}
