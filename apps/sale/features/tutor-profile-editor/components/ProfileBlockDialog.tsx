"use client";

import { useEffect, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import {
  tutorProfileEditorSchema,
  type TutorProfileEditorValues,
} from "../schemas/profile-editor.schema";

interface ProfileBlockDialogProps {
  open: boolean;
  title: string;
  description: string;
  profile: TutorProfileEditorValues;
  children: ReactNode;
  onClose: () => void;
  onSave: (values: TutorProfileEditorValues) => void;
}

export function ProfileBlockDialog({
  open,
  title,
  description,
  profile,
  children,
  onClose,
  onSave,
}: ProfileBlockDialogProps) {
  const form = useForm<TutorProfileEditorValues>({
    resolver: zodResolver(tutorProfileEditorSchema),
    defaultValues: profile,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) form.reset(profile);
  }, [form, open, profile]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-[#cfe1fa] bg-white p-0 sm:w-[calc(100vw-2rem)]">
        <div className="border-b border-[#dce7f7] px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-nunito text-xl font-extrabold text-[#17142f] sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1.5 max-w-xl leading-6 text-[#56516a]">
            {description}
          </DialogDescription>
        </div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSave)}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-5">{children}</div>
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#dce7f7] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-full px-5">
                Hủy
              </Button>
              <Button type="submit" className="h-10 rounded-full bg-[#280f91] px-5 text-white hover:bg-[#200c76]">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
