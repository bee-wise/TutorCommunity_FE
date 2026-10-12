import { Button } from "@workspace/ui/components/ui/button";
import type { useInterviewRubricUpload } from "../hooks/useInterviewActions";
import { InterviewRubricFileInput } from "./InterviewRubricFileInput";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

export function InterviewRubricUpload({
  model,
  onCancel,
}: {
  model: ReturnType<typeof useInterviewRubricUpload>;
  onCancel: () => void;
}) {
  const { form, file, mutation, save } = model;
  return (
    <section className={panelClass}>
      <h3 className="font-nunito text-xl font-extrabold">Tải bộ câu hỏi mới</h3>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        File TOML tối đa 1 MB. Phiên bản nằm trong file; bản mới chưa áp dụng
        cho đến khi bạn xác nhận.
      </p>
      <form onSubmit={save} className="mt-5">
        <fieldset disabled={mutation.isPending} className="space-y-4">
          <InterviewRubricFileInput
            file={file}
            onChange={(selected) => {
              if (selected)
                form.setValue("file", selected, { shouldValidate: true });
              else form.resetField("file");
            }}
          />
          <FieldError message={form.formState.errors.file?.message} />
          <label className="block text-sm font-medium">
            Ghi chú thay đổi
            <textarea
              {...form.register("note")}
              rows={4}
              maxLength={2000}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <FieldError message={form.formState.errors.note?.message} />
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button type="submit" className={actionClass}>
              {mutation.isPending ? "Đang tải lên…" : "Tải rubric lên"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={actionClass}
              onClick={onCancel}
            >
              Đóng trình tải lên
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
