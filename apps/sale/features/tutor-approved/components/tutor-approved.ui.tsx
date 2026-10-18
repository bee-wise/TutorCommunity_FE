"use client";
/* eslint-disable @typescript-eslint/no-unused-vars -- compact screen components share destructured state */

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import { Header } from "@workspace/ui/components/layout/Header";
import type { MeType } from "@workspace/core/types/auth.type";
import { TUTOR_LMS_URL } from "@workspace/core/constants/tutor-links";
import { useTutorApproved } from "./TutorApprovedProvider";
import type { TutorApprovedScreen } from "../types";
import { ChatSummary, MessagesScreen, ChatRoomScreen } from "../../messages";
import { TutorProfileEditorScreen } from "../../tutor-profile-editor";
import { TutorOwnProfileScreen } from "../../tutor-profile/components/TutorOwnProfileScreen";
import { TutorHomeScreen } from "./TutorHomeScreen";

const card =
  "rounded-2xl border border-[#dce7f7] bg-white p-5 shadow-[0_12px_32px_rgba(40,15,145,0.07)]";
const badge =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold";

export function TutorApprovedShell({
  children,
  previewUser,
  capture = false,
  toolbar,
  screen,
}: {
  children: ReactNode;
  previewUser?: MeType;
  capture?: boolean;
  toolbar?: ReactNode;
  screen?: TutorApprovedScreen;
}) {
  const isChat = screen === "messages" || screen === "chat-room";
  const isProfileEdit = screen === "profile-edit";

  if (isProfileEdit) {
    return (
      <div className="min-h-[100dvh] bg-[#f7f9fd] text-[#17142f]">
        {children}
      </div>
    );
  }

  if (isChat) {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f7f9fd] text-[#17142f]">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#17142f]">
      <Header
        {...(previewUser
          ? {
              previewUser,
              previewIsAuthenticated: true,
              previewIsAuthLoading: false,
              previewLogout: () => undefined,
            }
          : {})}
      />
      {!capture && toolbar}
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export function TutorApprovedScreenView({
  screen = "home",
  chatRoomId,
}: {
  screen?: TutorApprovedScreen;
  chatRoomId?: string;
}) {
  if (screen === "profile-edit") return <TutorProfileEditorScreen />;
  if (screen === "profile") return <TutorOwnProfileScreen />;
  if (screen === "messages") return <MessagesScreen />;
  if (screen === "chat-room") return <ChatRoomScreen chatRoomId={chatRoomId} />;
  if (screen === "notifications") return <NotificationsScreen />;
  if (screen === "availability") return <AvailabilityScreen />;
  if (screen === "subscription") return <SubscriptionScreen />;
  return <TutorHomeScreen />;
}

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold text-primary">{title}</h2>
      {action}
    </div>
  );
}

function NotificationsScreen() {
  const { state, dispatch } = useTutorApproved();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-nunito text-3xl font-black">Thông báo</h1>
          <p className="text-sm text-[#716c83]">
            Theo dõi kết nối, tin nhắn, hồ sơ và gói hiển thị.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "mark-all-read" })}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>
      <section className={card}>
        {state.notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => dispatch({ type: "mark-read", id: n.id })}
            className={`flex w-full gap-4 border-b border-[#edf0f7] p-4 text-left last:border-0 ${n.read ? "opacity-65" : "bg-[#faf9ff]"}`}
          >
            <span className="mt-1 rounded-full bg-[#f4f1ff] p-2 text-primary">
              <Bell size={18} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 font-bold">
                {n.title}
                {!n.read && (
                  <span
                    className="h-2 w-2 rounded-full bg-primary"
                    aria-label="Chưa đọc"
                  />
                )}
              </span>
              <span className="block text-sm text-[#716c83]">
                {n.description}
              </span>
              <span className="mt-1 block text-xs text-[#8b8798]">
                {n.time}
              </span>
            </span>
            {n.actionLabel && (
              <span className="text-xs font-bold text-primary">
                {n.actionLabel}
              </span>
            )}
          </button>
        ))}
      </section>
    </div>
  );
}

function AvailabilityScreen() {
  const { state, dispatch } = useTutorApproved();
  const [error, setError] = useState("");
  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const day = String(fd.get("day")),
      start = String(fd.get("start")),
      end = String(fd.get("end")),
      mode = String(fd.get("mode")) as
        | "Online"
        | "Offline"
        | "Online và Offline";
    if (
      state.availability.some(
        (s) => s.day === day && start < s.end && end > s.start,
      )
    ) {
      setError("Khung giờ này bị trùng với lịch rảnh hiện có.");
      return;
    }
    dispatch({
      type: "add-slot",
      slot: { id: crypto.randomUUID(), day, start, end, mode },
    });
    setError("");
    e.currentTarget.reset();
  }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-nunito text-3xl font-black">Lịch rảnh nhận lớp</h1>
        <p className="text-sm text-[#716c83]">
          Lịch lớp đã hình thành được quản lý trong Tutor LMS.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={add} className={`${card} space-y-4`}>
          <SectionTitle title="Thêm khung giờ" />
          <Field label="Ngày">
            <select
              name="day"
              className="w-full rounded-xl border p-3"
              defaultValue="Thứ Hai"
            >
              {[
                "Thứ Hai",
                "Thứ Ba",
                "Thứ Tư",
                "Thứ Năm",
                "Thứ Sáu",
                "Thứ Bảy",
                "Chủ Nhật",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bắt đầu">
              <input
                required
                name="start"
                type="time"
                className="w-full rounded-xl border p-3"
              />
            </Field>
            <Field label="Kết thúc">
              <input
                required
                name="end"
                type="time"
                className="w-full rounded-xl border p-3"
              />
            </Field>
          </div>
          <Field label="Hình thức">
            <select name="mode" className="w-full rounded-xl border p-3">
              <option>Online</option>
              <option>Offline</option>
              <option>Online và Offline</option>
            </select>
          </Field>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit">
            <Plus />
            Thêm khung giờ
          </Button>
        </form>
        <section className={card}>
          <SectionTitle title="Lịch hiện tại" />
          {state.availability.length ? (
            state.availability.map((s) => (
              <div
                key={s.id}
                className="mb-3 flex items-center justify-between rounded-xl bg-[#f7f9fd] p-4"
              >
                <div>
                  <strong>{s.day}</strong>
                  <p className="text-sm text-[#716c83]">
                    {s.start}–{s.end} · {s.mode}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Xóa lịch ${s.day}`}
                  onClick={() => dispatch({ type: "delete-slot", id: s.id })}
                >
                  <Trash2 />
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              title="Bạn chưa thiết lập lịch rảnh"
              description="Thêm khung giờ để Learner biết khi nào bạn có thể nhận lớp."
            />
          )}
        </section>
      </div>
    </div>
  );
}

function SubscriptionScreen() {
  const { state, dispatch } = useTutorApproved();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-nunito text-3xl font-black">Gói hiển thị hồ sơ</h1>
        <p className="text-sm text-[#716c83]">
          Duy trì khả năng xuất hiện trong Search, AI Search và nhận kết nối
          mới.
        </p>
      </div>
      <section className={card}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <span className={`${badge} bg-[#fff8df] text-[#905b0f]`}>
              Preview · Không phải giao dịch thật
            </span>
            <h2 className="mt-3 text-2xl font-black">Gói hiển thị 6 tháng</h2>
            <p className="mt-2 text-3xl font-black text-primary">50.000 VNĐ</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Tiếp tục hiển thị hồ sơ",
                "Xuất hiện trong Search và AI Search",
                "Tiếp tục nhận kết nối mới",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <CheckCircle2 className="text-[#297044]" size={18} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-56 rounded-2xl bg-[#f4f1ff] p-5">
            <Info label="Ngày bắt đầu mới" value="Sau ngày hết hạn hiện tại" />
            <Info label="Ngày hết hạn dự kiến" value="Sau 6 tháng" />
            <Button
              className="mt-3 w-full"
              onClick={() => dispatch({ type: "open-renewal" })}
            >
              Gia hạn gói
            </Button>
          </div>
        </div>
      </section>
      <RenewalDialog />
    </div>
  );
}

function RenewalDialog() {
  const { state, dispatch } = useTutorApproved();
  if (!state.renewalOpen && !state.renewalConfirmed) return null;
  if (state.renewalConfirmed)
    return (
      <div
        role="status"
        className="fixed bottom-5 right-5 z-100 rounded-xl bg-[#297044] p-4 text-sm font-bold text-white shadow-xl"
      >
        Đã ghi nhận thao tác gia hạn ở chế độ Preview.
      </div>
    );
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="renew-title"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-[#905b0f]">
              Preview
            </p>
            <h2 id="renew-title" className="text-xl font-black">
              Xác nhận gia hạn gói
            </h2>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Đóng"
            onClick={() => dispatch({ type: "close-renewal" })}
          >
            <X />
          </Button>
        </div>
        <p className="mt-3 text-sm text-[#716c83]">
          Gói 50.000 VNĐ / 6 tháng. Thao tác này chỉ cập nhật mock state, không
          gọi PayOS hoặc payment API.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "close-renewal" })}
          >
            Hủy
          </Button>
          <Button onClick={() => dispatch({ type: "confirm-renewal" })}>
            Xác nhận Preview
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-[#cbd6ea] p-8 text-center">
      {icon && <span className="mb-3 text-primary">{icon}</span>}
      <strong>{title}</strong>
      <p className="mt-1 max-w-md text-sm text-[#716c83]">{description}</p>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[#8b8798]">
        {label}
      </p>
      <p className="mt-0.5 text-sm leading-6">{value}</p>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <span className="mt-1 block font-normal">{children}</span>
    </label>
  );
}
