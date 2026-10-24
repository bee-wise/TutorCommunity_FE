"use client";

import { useMemo, type ReactNode } from "react";
import {
  FormProvider,
  set,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import {
  tutorProfileFormSchema,
  type TutorProfileFormValues,
} from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import type {
  ProfileFieldName,
  ProfileSectionPatch,
} from "../../types/profile-editor.types";
import type { SectionDialogProps } from "./section-dialog.types";

/**
 * Validates with the full registration schema but only reports issues for the
 * fields this dialog owns, so an unrelated incomplete field never blocks saving.
 */
function createSectionResolver(
  fields: readonly ProfileFieldName[],
): Resolver<TutorProfileFormValues> {
  return async (values) => {
    const result = tutorProfileFormSchema.safeParse(values);
    if (result.success) return { values, errors: {} };

    const errors: Record<string, unknown> = {};
    for (const issue of result.error.issues) {
      const root = issue.path[0];
      if (typeof root !== "string" || !fields.includes(root as ProfileFieldName)) {
        continue;
      }
      const path = issue.path.map(String).join(".");
      set(errors, path, { type: issue.code, message: issue.message });
    }
    return Object.keys(errors).length
      ? { values: {}, errors: errors as FieldErrors<TutorProfileFormValues> }
      : { values, errors: {} };
  };
}

interface ProfileSectionDialogProps extends SectionDialogProps {
  title: string;
  description: string;
  fields: readonly ProfileFieldName[];
  children: ReactNode;
  size?: "md" | "lg";
}

export function ProfileSectionDialog({
  title,
  description,
  fields,
  profile,
  isSaving,
  onClose,
  onSave,
  children,
  size = "lg",
}: ProfileSectionDialogProps) {
  const resolver = useMemo(() => createSectionResolver(fields), [fields]);
  const form = useForm<TutorProfileFormValues>({
    resolver,
    defaultValues: profile,
    mode: "onTouched",
  });

  const submit = form.handleSubmit(async (values) => {
    const patch: ProfileSectionPatch = {};
    for (const field of fields) {
      (patch as Record<string, unknown>)[field] = values[field];
    }
    await onSave(patch);
  });

  return (
    <Dialog open onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent
        className={`flex max-h-[90dvh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-[#cfe1fa] bg-white p-0 ${size === "lg" ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <header className="shrink-0 border-b border-[#dce7f7] px-6 py-5 pr-14 sm:px-8">
          <DialogTitle className="font-nunito text-xl font-extrabold text-[#17142f] sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1.5 max-w-2xl leading-6 text-[#56516a]">
            {description}
          </DialogDescription>
        </header>
        <FormProvider {...form}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="space-y-6">{children}</div>
            </div>
            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#dce7f7] bg-white px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={onClose}
                className="h-11 rounded-full px-6"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 rounded-full bg-primary px-6 text-white hover:bg-[#200c76]"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </footer>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
