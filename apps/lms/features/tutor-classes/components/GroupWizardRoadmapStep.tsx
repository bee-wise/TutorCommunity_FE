"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { GroupRoadmapValues } from "../hooks/useGroupClassWizard";
import { GroupWizardField, wizardFieldProps, wizardTextareaClass } from "./GroupWizardField";
import { classInput, classOutlineButton } from "./classes-ui";

const nextOrder = (items: { order: number }[]) => Math.max(0, ...items.map((item) => item.order)) + 1;

function StageFields({
  form,
  index,
  onRemove,
}: {
  form: UseFormReturn<GroupRoadmapValues>;
  index: number;
  onRemove: () => void;
}) {
  const lessons = useFieldArray({ control: form.control, name: `stages.${index}.lessons` });
  const stageErrors = form.formState.errors.stages?.[index];
  const titleError = stageErrors?.title && "Nhập tên chặng.";
  return (
    <fieldset aria-labelledby={`stage-${index}-heading`} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 id={`stage-${index}-heading`} className="font-lms text-sm font-extrabold text-foreground">Chặng {index + 1}</h3>
        <Button type="button" variant="ghost" size="icon" className="size-11 text-destructive" aria-label={`Bỏ chặng ${index + 1}`} onClick={onRemove}>
          <TrashIcon className="size-[18px]" aria-hidden="true" />
        </Button>
      </div>
      <GroupWizardField id={`stage-${index}-title`} label="Tên chặng" error={titleError}>
        <input className={classInput} {...wizardFieldProps(`stage-${index}-title`, titleError)} {...form.register(`stages.${index}.title`)} />
      </GroupWizardField>
      <GroupWizardField id={`stage-${index}-objective`} label="Mục tiêu">
        <textarea className={`${wizardTextareaClass} h-24`} {...wizardFieldProps(`stage-${index}-objective`)} {...form.register(`stages.${index}.objective`)} />
      </GroupWizardField>
      {lessons.fields.map((field, i) => {
        const id = `stage-${index}-lesson-${i}`;
        const lessonError = stageErrors?.lessons?.[i]?.title && "Nhập tên bài.";
        return (
          <div key={field.id} className="grid gap-2 rounded-2xl border border-border bg-muted p-3">
            <div className="flex items-end gap-2">
              <GroupWizardField id={`${id}-title`} label={`Bài ${i + 1}`} error={lessonError} className="flex-1">
                <input className={classInput} {...wizardFieldProps(`${id}-title`, lessonError)} {...form.register(`stages.${index}.lessons.${i}.title`)} />
              </GroupWizardField>
              <Button type="button" variant="ghost" size="icon" className="size-11 shrink-0" aria-label={`Bỏ bài ${i + 1}`} onClick={() => lessons.remove(i)}>
                <TrashIcon className="size-[18px]" aria-hidden="true" />
              </Button>
            </div>
            <GroupWizardField id={`${id}-content`} label="Nội dung bài">
              <textarea className={`${wizardTextareaClass} h-24`} {...wizardFieldProps(`${id}-content`)} {...form.register(`stages.${index}.lessons.${i}.content`)} />
            </GroupWizardField>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        className={classOutlineButton}
        onClick={() =>
          lessons.append({
            id: crypto.randomUUID(),
            title: "",
            content: "",
            order: nextOrder(form.getValues(`stages.${index}.lessons`)),
          })
        }
      >
        <PlusIcon className="size-4" aria-hidden="true" />
        Thêm bài
      </Button>
    </fieldset>
  );
}

export function GroupWizardRoadmapStep({ form }: { form: UseFormReturn<GroupRoadmapValues> }) {
  const stages = useFieldArray({ control: form.control, name: "stages" });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Lộ trình chỉ mô tả nội dung học, không tạo buổi học. Buổi học thực tế được tạo sau khi lớp khai giảng.
      </p>
      {!stages.fields.length && (
        <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Chưa có chặng nào. Thêm chặng đầu tiên để học viên biết lớp sẽ học gì.
        </p>
      )}
      {stages.fields.map((stage, index) => (
        <StageFields key={stage.id} form={form} index={index} onRemove={() => stages.remove(index)} />
      ))}
      <Button
        type="button"
        variant="outline"
        className={classOutlineButton}
        onClick={() =>
          stages.append({
            id: crypto.randomUUID(),
            title: "",
            objective: "",
            order: nextOrder(form.getValues("stages")),
            lessons: [],
          })
        }
      >
        <PlusIcon className="size-4" aria-hidden="true" />
        Thêm chặng
      </Button>
    </div>
  );
}
