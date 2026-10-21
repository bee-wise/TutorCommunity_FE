"use client";

import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  roadmapCommandSchema,
  type GroupDto,
} from "@workspace/core/lms-classes/group.schemas";
import { groupClassesService } from "@workspace/core/lms-classes/group.service";
import { useLmsClassCommand } from "@workspace/core/lms-classes/useLmsClassResource";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  classButton,
  classInput,
  classOutlineButton,
  classPanel,
} from "./classes-ui";

type Values = z.infer<typeof roadmapCommandSchema>;
function StageFields({
  form,
  index,
  onRemove,
  disabled,
}: {
  form: UseFormReturn<Values>;
  index: number;
  onRemove: () => void;
  disabled: boolean;
}) {
  const lessons = useFieldArray({
    control: form.control,
    name: `stages.${index}.lessons`,
  });
  return (
    <fieldset disabled={disabled} className={`${classPanel} space-y-3`}>
      <legend className="px-2 font-bold">Giai đoạn {index + 1}</legend>
      <label className="grid gap-1 text-xs">
        Tên giai đoạn
        <input
          className={classInput}
          {...form.register(`stages.${index}.title`)}
        />
      </label>
      <label className="grid gap-1 text-xs">
        Mục tiêu
        <textarea
          className={`${classInput} h-20`}
          {...form.register(`stages.${index}.objective`)}
        />
      </label>
      {lessons.fields.map((field, i) => (
        <div
          key={field.id}
          className="grid gap-2 rounded-2xl border border-border p-3"
        >
          <label className="grid gap-1 text-xs">
            Tên bài {i + 1}
            <input
              className={classInput}
              {...form.register(`stages.${index}.lessons.${i}.title`)}
            />
          </label>
          <label className="grid gap-1 text-xs">
            Nội dung
            <textarea
              className={`${classInput} h-20`}
              {...form.register(`stages.${index}.lessons.${i}.content`)}
            />
          </label>
          <Button
            type="button"
            variant="outline"
            className={classOutlineButton}
            onClick={() => lessons.remove(i)}
          >
            Bỏ bài này
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className={classOutlineButton}
          onClick={() =>
            lessons.append({
              id: crypto.randomUUID(),
              title: "",
              content: "",
              order:
                Math.max(
                  0,
                  ...form
                    .getValues(`stages.${index}.lessons`)
                    .map((lesson) => lesson.order),
                ) + 1,
            })
          }
        >
          Thêm bài
        </Button>
        <Button
          type="button"
          variant="outline"
          className={classOutlineButton}
          onClick={onRemove}
        >
          Bỏ giai đoạn
        </Button>
      </div>
    </fieldset>
  );
}
export function GroupRoadmapDialog({
  data,
  onClose,
}: {
  data: GroupDto;
  onClose: () => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(roadmapCommandSchema),
    defaultValues: { expectedVersion: data.version, stages: data.roadmap },
  });
  const stages = useFieldArray({ control: form.control, name: "stages" });
  const save = useLmsClassCommand(data.id, (input: Values) =>
    groupClassesService.roadmap(data.id, input),
  );
  const submit = form.handleSubmit(async (value) => {
    try {
      await save.mutateAsync({
        ...value,
        stages: value.stages.map((s, i) => ({
          ...s,
          order: i + 1,
          lessons: s.lessons.map((l, j) => ({ ...l, order: j + 1 })),
        })),
      });
      toast.success("Đã lưu lộ trình");
      onClose();
    } catch {
      toast.error("Chưa lưu được lộ trình", {
        description: "Tải lại để lấy phiên bản mới khi dữ liệu thay đổi.",
      });
    }
  });
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !save.isPending) onClose();
      }}
    >
      <DialogContent className="flex max-h-[90dvh] max-w-3xl flex-col overflow-hidden rounded-3xl">
        <DialogHeader>
          <DialogTitle>Lộ trình lớp nhóm</DialogTitle>
          <DialogDescription>
            Lộ trình không tự tạo lịch hoặc buổi học. Gia sư tạo các buổi thực
            tế riêng sau khi lớp ACTIVE.
          </DialogDescription>
        </DialogHeader>
        <form className="min-h-0 space-y-4 overflow-y-auto" onSubmit={submit}>
          {stages.fields.map((s, index) => (
            <StageFields
              key={s.id}
              form={form}
              index={index}
              disabled={save.isPending}
              onRemove={() => stages.remove(index)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            className={classOutlineButton}
            disabled={save.isPending}
            onClick={() =>
              stages.append({
                id: crypto.randomUUID(),
                title: "",
                objective: "",
                order:
                  Math.max(
                    0,
                    ...form.getValues("stages").map((stage) => stage.order),
                  ) + 1,
                lessons: [],
              })
            }
          >
            Thêm giai đoạn
          </Button>
          {Object.keys(form.formState.errors).length > 0 && (
            <p role="alert" className="text-sm text-destructive">
              Nhập tên giai đoạn/bài học và kiểm tra thứ tự các mục.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className={classOutlineButton}
              disabled={save.isPending}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button className={classButton} disabled={save.isPending}>
              Lưu lộ trình
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
