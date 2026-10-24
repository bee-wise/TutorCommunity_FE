"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import type { GroupDraft } from "@workspace/core/lms-classes/group.schemas";
import { utcToVietnamInput, vietnamTimeToUtc } from "@workspace/core/lms-classes/lifecycle";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { GroupWizardField, wizardFieldProps } from "./GroupWizardField";
import { classInput } from "./classes-ui";

const numberFields = [
  { name: "capacity", label: "Sĩ số tối đa", min: 2, error: "Sĩ số tối thiểu 2 học viên." },
  { name: "numberOfSessions", label: "Số buổi", min: 1, error: "Nhập số buổi lớn hơn 0." },
  { name: "sessionDurationMinutes", label: "Phút mỗi buổi", min: 1, error: "Nhập thời lượng lớn hơn 0." },
  { name: "pricePerSession", label: "Học phí mỗi buổi (VND)", min: 1, error: "Nhập học phí lớn hơn 0." },
] as const;
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export function GroupWizardScheduleStep({
  form,
  portalContainer,
}: {
  form: UseFormReturn<GroupDraft>;
  portalContainer: HTMLElement | null;
}) {
  const [openingAt, billingMode, sessions, price] = useWatch({
    control: form.control,
    name: ["openingAt", "billingMode", "numberOfSessions", "pricePerSession"],
  });
  const errors = form.formState.errors;
  const estimate = Number.isFinite(sessions * price) && sessions > 0 && price > 0 ? sessions * price : null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <DateTimePicker
          id="group-opening-at"
          label="Khai giảng (giờ Việt Nam)"
          value={openingAt ? utcToVietnamInput(openingAt) : ""}
          onChange={(value) => form.setValue("openingAt", value ? vietnamTimeToUtc(value) : null, { shouldDirty: true, shouldValidate: true })}
          error={errors.openingAt ? "Chọn lại thời gian khai giảng." : undefined}
          portalContainer={portalContainer}
          side="bottom"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Lớp tự ẩn khỏi trang tuyển sinh khi qua ngày khai giảng.
        </p>
      </div>
      {numberFields.map((field) => {
        const id = `group-${field.name}`;
        const error = errors[field.name] && field.error;
        return (
          <GroupWizardField key={field.name} id={id} label={field.label} error={error}>
            <input
              type="number"
              inputMode="numeric"
              min={field.min}
              step={1}
              className={`${classInput} tabular-nums`}
              {...wizardFieldProps(id, error)}
              {...form.register(field.name, { valueAsNumber: true })}
            />
          </GroupWizardField>
        );
      })}
      <GroupWizardField id="group-billing" label="Cách tính phí">
        <ClassFilterSelect
          id="group-billing"
          value={billingMode ?? "MONTHLY"}
          onValueChange={(v) => form.setValue("billingMode", v === "FULL_COURSE" ? "FULL_COURSE" : "MONTHLY", { shouldDirty: true })}
          options={[
            { value: "MONTHLY", label: "Theo tháng" },
            { value: "FULL_COURSE", label: "Cả khóa" },
          ]}
        />
      </GroupWizardField>
      <div className="grid content-end gap-0.5 rounded-2xl border border-border bg-muted px-4 py-3">
        <span className="text-xs font-bold text-muted-foreground">Tạm tính học phí cả khóa</span>
        <span className="font-lms text-lg font-extrabold tabular-nums text-primary">
          {estimate === null ? "Chưa đủ thông tin" : currency.format(estimate)}
        </span>
      </div>
    </div>
  );
}
