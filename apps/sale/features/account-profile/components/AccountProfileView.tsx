"use client";

import { useRef } from "react";
import {
  Bell,
  Camera,
  Check,
  EnvelopeSimple,
  PencilSimple,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react";
import type { MeType } from "@workspace/core/types/auth.type";
import { cn } from "@workspace/core/helpers/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { Button } from "@workspace/ui/components/ui/button";
import { useAccountProfileDemo } from "../hooks/useAccountProfileDemo";
import {
  getInitials,
  getRoleLabel,
  type ProfileTab,
} from "../types/account-profile";
import { ProfileBasicsPanel } from "./ProfileBasicsPanel";
import { ProfileEditDialog } from "./ProfileEditDialog";
import {
  ProfileNotificationsPanel,
  ProfileSecurityPanel,
} from "./ProfilePreferencesPanels";

const navigation = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: UserCircle },
  { id: "security", label: "Bảo mật", icon: ShieldCheck },
  { id: "notifications", label: "Thông báo", icon: Bell },
] satisfies { id: ProfileTab; label: string; icon: typeof UserCircle }[];

export function AccountProfileView({ user }: { user: MeType }) {
  const demo = useAccountProfileDemo(user);
  const fileInput = useRef<HTMLInputElement>(null);
  const name = demo.profile.fullName || "Thành viên BeeWise";

  return (
    <div className="min-h-[75dvh] bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Không gian của bạn
            </p>
            <h1 className="font-nunito text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Tài khoản cá nhân
            </h1>
          </div>
          <div className="max-w-72 sm:text-right">
            <span className="inline-flex rounded-md border border-accent bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
              DEMO TƯƠNG TÁC
            </span>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              Thay đổi chỉ áp dụng trong phiên xem này.
            </p>
          </div>
        </div>

        <section
          aria-label="Tổng quan tài khoản"
          className="relative overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                aria-label="Đổi ảnh đại diện"
                title="JPG, PNG hoặc WebP, tối đa 5 MB"
                className="group relative block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                <Avatar className="h-24 w-24 border-4 border-muted sm:h-28 sm:w-28">
                  <AvatarImage
                    src={demo.avatar}
                    alt={`Ảnh đại diện của ${name}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-nunito bg-muted text-3xl font-black text-primary">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground transition-colors group-hover:bg-secondary">
                  <Camera size={16} weight="bold" aria-hidden="true" />
                </span>
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) demo.updateAvatar(file);
                  event.target.value = "";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-bold text-primary">
                  {getRoleLabel(user.role)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Check size={13} weight="bold" aria-hidden="true" />
                  Thành viên BeeWise
                </span>
              </div>
              <h2 className="font-nunito break-words text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {name}
              </h2>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <EnvelopeSimple
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="break-all">
                  {user.email || "Chưa cập nhật email"}
                </span>
              </p>
            </div>
            <Button
              onClick={() => demo.setEditing(true)}
              className="h-10 rounded-lg font-bold sm:self-center"
            >
              <PencilSimple weight="bold" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <nav
              aria-label="Cài đặt tài khoản"
              className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2 lg:flex-col"
            >
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={demo.tab === id}
                  onClick={() => demo.setTab(id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    demo.tab === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    size={19}
                    weight={demo.tab === id ? "fill" : "regular"}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              ))}
            </nav>
            <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">
                  Hoàn thiện hồ sơ
                </p>
                <span className="text-sm font-extrabold text-primary">
                  {demo.completion}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Mức độ hoàn thiện hồ sơ"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={demo.completion}
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary motion-safe:transition-[width]"
                  style={{ width: `${demo.completion}%` }}
                />
              </div>
              <p className="mt-3 hidden text-xs leading-5 text-muted-foreground lg:block">
                {demo.completion === 100
                  ? "Hồ sơ demo của bạn đã đầy đủ. Cảm ơn bạn đã chia sẻ!"
                  : "Thêm ảnh và một vài điều về bạn để hồ sơ đầy đủ hơn."}
              </p>
              {demo.completion < 100 && (
                <button
                  type="button"
                  onClick={() => demo.setEditing(true)}
                  className="mt-3 hidden text-xs font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:inline-block"
                >
                  Cập nhật thông tin
                </button>
              )}
            </div>
          </aside>
          <div className="min-w-0">
            {demo.tab === "profile" && (
              <ProfileBasicsPanel user={user} demo={demo} />
            )}
            {demo.tab === "security" && <ProfileSecurityPanel demo={demo} />}
            {demo.tab === "notifications" && (
              <ProfileNotificationsPanel demo={demo} />
            )}
          </div>
        </div>
      </div>
      {demo.editing && (
        <ProfileEditDialog
          values={demo.profile}
          onClose={() => demo.setEditing(false)}
          onSave={demo.saveProfile}
        />
      )}
    </div>
  );
}
