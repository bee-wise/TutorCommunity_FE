"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import type { GroupDraft } from "@workspace/core/lms-classes/group.schemas";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { GroupWizardField, wizardFieldProps, wizardTextareaClass } from "./GroupWizardField";
import { classInput } from "./classes-ui";

export function GroupWizardDetailsStep({ form }: { form: UseFormReturn<GroupDraft> }) {
  const mode = useWatch({ control: form.control, name: "teachingMode" });
  const errors = form.formState.errors;
  const titleError = errors.title && "Nhập tên lớp, tối đa 200 ký tự.";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <GroupWizardField id="group-title" label="Tên lớp" error={titleError} className="sm:col-span-2">
        <input
          className={classInput}
          placeholder="Ví dụ: Toán 10 nâng cao - nhóm tối thứ 3"
          {...wizardFieldProps("group-title", titleError)}
          {...form.register("title")}
        />
      </GroupWizardField>
      <GroupWizardField id="group-mode" label="Hình thức học">
        <ClassFilterSelect
          id="group-mode"
          value={mode ?? "ONLINE"}
          onValueChange={(v) => form.setValue("teachingMode", v === "OFFLINE" ? "OFFLINE" : "ONLINE", { shouldDirty: true })}
          options={[
            { value: "ONLINE", label: "Trực tuyến" },
            { value: "OFFLINE", label: "Trực tiếp" },
          ]}
        />
      </GroupWizardField>
      <GroupWizardField
        id="group-location"
        label="Địa điểm"
        hint={mode === "OFFLINE" ? "Địa chỉ học viên sẽ đến học." : "Có thể để trống với lớp trực tuyến."}
      >
        <input className={classInput} {...wizardFieldProps("group-location")} {...form.register("location")} />
      </GroupWizardField>
      <GroupWizardField id="group-highlight" label="Điểm nổi bật" className="sm:col-span-2">
        <input
          className={classInput}
          placeholder="Ví dụ: Ôn chắc kiến thức nền, luyện đề hằng tuần"
          {...wizardFieldProps("group-highlight")}
          {...form.register("highlight")}
        />
      </GroupWizardField>
      <GroupWizardField id="group-description" label="Nội dung lớp" className="sm:col-span-2">
        <textarea
          className={`${wizardTextareaClass} h-32`}
          {...wizardFieldProps("group-description")}
          {...form.register("description")}
        />
      </GroupWizardField>
    </div>
  );
}
