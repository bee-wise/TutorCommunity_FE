import { Button } from "@workspace/ui/components/ui/button";
import type { useInterviewPolicyForm } from "../hooks/useInterviewActions";
import { actionClass, fieldClass, FieldError, panelClass } from "./InterviewUi";

export function InterviewPolicyEditor({
  model,
  onCancel,
}: {
  model: ReturnType<typeof useInterviewPolicyForm>;
  onCancel: () => void;
}) {
  const { form, mutation, save } = model;
  return (
    <section className={panelClass}>
      <h2 className="font-nunito text-xl font-extrabold">
        Tạo phiên bản quy định
      </h2>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Tạo bản mới để sửa nội dung. Chọn Áp dụng sau khi kiểm tra; gia sư sẽ
        cần xác nhận quy định mới.
      </p>
      <form onSubmit={save} className="mt-5">
        <fieldset disabled={mutation.isPending} className="space-y-4">
          <label className="block text-sm font-medium">
            Phiên bản
            <input
              {...form.register("version")}
              maxLength={50}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <FieldError message={form.formState.errors.version?.message} />
          <label className="block text-sm font-medium">
            Nội dung quy định
            <textarea
              {...form.register("content")}
              maxLength={100000}
              rows={12}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <FieldError message={form.formState.errors.content?.message} />
          <label className="block text-sm font-medium">
            Câu xác nhận của gia sư
            <textarea
              {...form.register("confirmation_text")}
              maxLength={4000}
              rows={3}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <FieldError
            message={form.formState.errors.confirmation_text?.message}
          />
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button type="submit" className={actionClass}>
              {mutation.isPending ? "Đang tạo…" : "Tạo quy định"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={actionClass}
              onClick={onCancel}
            >
              Đóng trình soạn
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
