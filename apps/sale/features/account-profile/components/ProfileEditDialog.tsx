"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { profileSchema, type ProfileValues } from "../types/account-profile";

const fields = [
  { name: "fullName", label: "Họ và tên", type: "text", autoComplete: "name", placeholder: "Tên của bạn" },
  { name: "phoneNumber", label: "Số điện thoại", type: "tel", autoComplete: "tel", placeholder: "09xxxxxxxx" },
  { name: "location", label: "Thành phố", type: "text", autoComplete: "address-level2", placeholder: "Ví dụ: TP. Hồ Chí Minh" },
  { name: "birthday", label: "Ngày sinh", type: "date", autoComplete: "bday", placeholder: "" },
] satisfies { name: Exclude<keyof ProfileValues, "bio">; label: string; type: string; autoComplete: string; placeholder: string }[];

export function ProfileEditDialog({ values, onClose, onSave }: { values: ProfileValues; onClose: () => void; onSave: (values: ProfileValues) => void }) {
  const { register, handleSubmit, setFocus, formState: { errors } } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: values });

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-black/40" />
        <Dialog.Content onOpenAutoFocus={(event) => { event.preventDefault(); setFocus("fullName"); }} className="fixed left-1/2 top-1/2 z-110 max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <Dialog.Title className="font-nunito pr-6 text-2xl font-black text-foreground">Chỉnh sửa hồ sơ</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">Cập nhật thông tin trong bản demo. Thay đổi chỉ áp dụng trong phiên xem này.</Dialog.Description>
          <Dialog.Close aria-label="Đóng chỉnh sửa hồ sơ" className="absolute right-5 top-5 rounded-lg p-1.5 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} weight="bold" aria-hidden="true" /></Dialog.Close>
          <form noValidate onSubmit={handleSubmit(onSave)} className="mt-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={`profile-${field.name}`} className="mb-2 block text-sm font-bold text-foreground">{field.label}{field.name === "fullName" && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</label>
                  <Input id={`profile-${field.name}`} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} className="h-11 rounded-lg bg-background shadow-none" aria-required={field.name === "fullName"} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `profile-${field.name}-error` : undefined} {...register(field.name)} />
                  {errors[field.name] && <p id={`profile-${field.name}-error`} className="mt-1.5 text-xs text-destructive" role="alert">{errors[field.name]?.message}</p>}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <label htmlFor="profile-bio" className="mb-2 block text-sm font-bold text-foreground">Giới thiệu bản thân</label>
              <textarea id="profile-bio" rows={4} placeholder="Sở thích, mục tiêu hay một điều thú vị về bạn…" className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(errors.bio)} aria-describedby={errors.bio ? "profile-bio-error" : "profile-bio-hint"} {...register("bio")} />
              {errors.bio ? <p id="profile-bio-error" className="mt-1 text-xs text-destructive" role="alert">{errors.bio.message}</p> : <p id="profile-bio-hint" className="mt-1 text-xs text-muted-foreground">Tối đa 300 ký tự.</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg font-bold shadow-none hover:bg-muted">Hủy</Button>
              <Button type="submit" className="h-10 rounded-lg font-bold">Lưu thay đổi demo</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
