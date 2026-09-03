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
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
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
  return <HomeScreen />;
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
      <h2 className="text-lg font-extrabold text-[#280f91]">{title}</h2>
      {action}
    </div>
  );
}

function HomeScreen() {
  const { state } = useTutorApproved();
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          <ChatSummary />
          <PublicProfileCard />
          <RecentActivity />
        </div>
        <aside className="space-y-6">
          <ProfileStatusCard />
          <ListingCard />
          <AvailabilitySummary />
          <NotificationSummary />
          {state.permissions.canAccessTutorLms && <LmsCard />}
        </aside>
      </div>
      <RenewalDialog />
    </div>
  );
}

function WelcomeBanner() {
  const { state, dispatch } = useTutorApproved();
  const expired = state.listingStatus === "EXPIRED";
  const expiring = state.listingStatus === "EXPIRING_SOON";
  const title = expired
    ? "Hồ sơ của bạn đang tạm ẩn"
    : expiring
      ? "Gói hiển thị của bạn sắp hết hạn"
      : `Chào mừng trở lại, ${state.profile.firstName}`;
  const description = expired
    ? "Gói hiển thị đã hết hạn. Gia hạn để tiếp tục xuất hiện trong kết quả tìm kiếm và nhận kết nối mới từ Learner."
    : expiring
      ? `Hồ sơ sẽ tạm ngừng xuất hiện trong kết quả tìm kiếm nếu gói không được gia hạn trước ngày ${state.listingEnd}.`
      : "Hồ sơ của bạn đã được xác thực và đang hiển thị trên BeeWise. Bạn có thể trao đổi với học viên, cập nhật lịch rảnh và quản lý lớp học trong Tutor LMS.";
  return (
    <section
      className={`overflow-hidden rounded-3xl p-6 text-white shadow-xl md:p-8 ${expired ? "bg-[#905b0f]" : expiring ? "bg-[#5b3d00]" : "bg-[#280f91]"}`}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffc510]">
            Tutor Home
          </p>
          <h1 className="font-nunito text-2xl font-black md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 md:text-base">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`${badge} bg-white/15`}>
              <ShieldCheck size={14} /> Gia sư đã xác thực
            </span>
            <span className={`${badge} bg-white/15`}>
              {expired ? "Hồ sơ đang tạm ẩn" : "Hồ sơ đang hiển thị"}
            </span>
            {!expired && (
              <span className={`${badge} bg-[#ffc510] text-[#280f91]`}>
                Sẵn sàng nhận lớp
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          {expired || expiring ? (
            <Button
              onClick={() => dispatch({ type: "open-renewal" })}
              className="rounded-full bg-[#ffc510] text-[#280f91] hover:bg-[#ffd54f]"
            >
              {expired ? "Gia hạn gói" : "Gia hạn ngay"}
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-full bg-[#ffc510] text-[#280f91] hover:bg-[#ffd54f]"
            >
              <Link href="/tutor/profile/public">Xem hồ sơ công khai</Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a
              href={expired || expiring ? "/tutor/subscription" : TUTOR_LMS_URL}
            >
              {expired || expiring ? "Xem chi tiết gói" : "Vào LMS"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}



function PublicProfileCard() {
  const { state } = useTutorApproved();
  const p = state.profile;
  return (
    <section className={card}>
      <SectionTitle
        title="Hồ sơ công khai"
        action={
          <span className={`${badge} bg-[#e7f5ec] text-[#297044]`}>
            <ShieldCheck size={13} /> Đã xác thực
          </span>
        }
      />
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#cfe1fa] text-2xl font-black text-[#280f91]">
          MA
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black">{p.fullName}</h3>
          <p className="font-bold text-[#280f91]">{p.title}</p>
          <p className="mt-2 text-sm leading-6 text-[#66617c]">
            {p.introduction}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {[
              p.university,
              p.major,
              ...p.subjects,
              ...p.gradeLevels,
              p.teachingMode,
              p.rate,
            ].map((item) => (
              <span
                key={item}
                className={`${badge} bg-[#f4f1ff] text-[#463d66]`}
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-sm">
            <Star className="fill-[#ffc510] text-[#ffc510]" size={16} />
            <strong>{p.rating}</strong> ({p.reviewCount} đánh giá)
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/tutor/profile/public">Xem hồ sơ công khai</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/tutor/profile/edit">
                <Pencil />
                Chỉnh sửa hồ sơ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileStatusCard() {
  const { state } = useTutorApproved();
  return (
    <section className={card}>
      <SectionTitle title="Trạng thái hồ sơ" />
      <span className={`${badge} bg-[#e7f5ec] text-[#297044]`}>
        <CheckCircle2 size={13} /> Đã xác thực bởi BeeWise
      </span>
      <dl className="mt-4 space-y-3 text-sm">
        {[
          ["Xác thực", "Đã duyệt"],
          [
            "Hồ sơ công khai",
            state.permissions.isProfilePublic ? "Đang hiển thị" : "Đang tạm ẩn",
          ],
          [
            "Nhận kết nối",
            state.permissions.canReceiveNewConnections
              ? "Đang hoạt động"
              : "Tạm dừng",
          ],
          ["Thông tin sau duyệt", "Đã hoàn tất"],
          ["LMS", state.permissions.canAccessTutorLms ? "Đã mở" : "Chưa mở"],
        ].map(([a, b]) => (
          <div key={a} className="flex justify-between gap-3">
            <dt className="text-[#716c83]">{a}</dt>
            <dd className="font-bold text-right">{b}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ListingCard() {
  const { state, dispatch } = useTutorApproved();
  const active = state.listingStatus !== "EXPIRED";
  return (
    <section className={card}>
      <SectionTitle title="Gói hiển thị hồ sơ" />
      <div className="flex items-center justify-between">
        <strong>Gói hiển thị 6 tháng</strong>
        <span
          className={`${badge} ${active ? "bg-[#e7f5ec] text-[#297044]" : "bg-[#fff0dd] text-[#905b0f]"}`}
        >
          {active
            ? state.listingStatus === "EXPIRING_SOON"
              ? `Còn ${state.daysRemaining} ngày`
              : "Đang hoạt động"
            : "Đã hết hạn"}
        </span>
      </div>
      <p className="mt-2 text-2xl font-black text-[#280f91]">50.000 VNĐ</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Bắt đầu</dt>
          <dd>{state.listingStart}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Hết hạn</dt>
          <dd>{state.listingEnd}</dd>
        </div>
      </dl>
      <Button
        onClick={() => dispatch({ type: "open-renewal" })}
        variant={
          active && state.listingStatus !== "EXPIRING_SOON"
            ? "outline"
            : "default"
        }
        className="mt-4 w-full"
      >
        {state.listingStatus === "EXPIRING_SOON"
          ? "Gia hạn ngay"
          : state.listingStatus === "EXPIRED"
            ? "Gia hạn gói"
            : "Xem chi tiết"}
      </Button>
    </section>
  );
}

function AvailabilitySummary() {
  const { state } = useTutorApproved();
  return (
    <section className={card}>
      <SectionTitle
        title="Lịch rảnh"
        action={
          <Link
            href="/tutor/availability"
            className="text-xs font-bold text-[#280f91]"
          >
            Cập nhật
          </Link>
        }
      />
      {state.availability.length ? (
        <div className="space-y-3">
          {state.availability.slice(0, 3).map((slot) => (
            <div key={slot.id} className="flex items-center gap-3 text-sm">
              <CalendarDays className="text-[#280f91]" size={18} />
              <div>
                <strong>{slot.day}</strong>
                <p className="text-xs text-[#716c83]">
                  {slot.start}–{slot.end} · {slot.mode}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Bạn chưa thiết lập lịch rảnh"
          description="Thiết lập lịch để nhận lớp phù hợp."
        />
      )}
    </section>
  );
}

function NotificationSummary() {
  const { state } = useTutorApproved();
  const unread = state.notifications.filter((x) => !x.read);
  return (
    <section className={card}>
      <SectionTitle
        title="Thông báo"
        action={
          <span
            aria-label={`${unread.length} thông báo chưa đọc`}
            className={`${badge} bg-[#ffc510] text-[#280f91]`}
          >
            {unread.length}
          </span>
        }
      />
      {unread.length ? (
        <div className="space-y-3">
          {unread.slice(0, 3).map((n) => (
            <div key={n.id} className="flex gap-3 text-sm">
              <Bell size={17} className="mt-0.5 shrink-0 text-[#280f91]" />
              <div>
                <strong>{n.title}</strong>
                <p className="text-xs text-[#716c83]">{n.description}</p>
              </div>
            </div>
          ))}
          <Link
            href="/tutor/notifications"
            className="block text-sm font-bold text-[#280f91]"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      ) : (
        <p className="text-sm text-[#716c83]">Bạn chưa có thông báo mới.</p>
      )}
    </section>
  );
}

function LmsCard() {
  return (
    <section className="rounded-2xl bg-[#280f91] p-5 text-white">
      <GraduationCap className="text-[#ffc510]" />
      <h2 className="mt-3 text-lg font-black">Quản lý lớp học của bạn</h2>
      <p className="mt-2 text-sm leading-6 text-white/75">
        Xem lớp đang dạy, lịch học, tài liệu, học phí và báo cáo buổi học trong
        Tutor LMS.
      </p>
      <Button
        asChild
        className="mt-4 w-full bg-[#ffc510] text-[#280f91] hover:bg-[#ffd54f]"
      >
        <a href={TUTOR_LMS_URL}>Vào LMS</a>
      </Button>
    </section>
  );
}

function RecentActivity() {
  const activities = [
    "Learner Nguyễn Hoàng Nam đã gửi tin nhắn.",
    "Consultant Trần Thu Hà đã tham gia phòng chat.",
    "Hồ sơ của bạn có 12 lượt xem trong tuần này.",
    "Lịch rảnh đã được cập nhật.",
  ];
  return (
    <section className={card}>
      <SectionTitle title="Hoạt động gần đây" />
      <div className="space-y-4">
        {activities.map((item, i) => (
          <div key={item} className="flex gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-[#280f91]" />
            <div>
              <p className="text-sm">{item}</p>
              <time className="text-xs text-[#716c83]">{i + 1} ngày trước</time>
            </div>
          </div>
        ))}
      </div>
    </section>
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
            <span className="mt-1 rounded-full bg-[#f4f1ff] p-2 text-[#280f91]">
              <Bell size={18} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 font-bold">
                {n.title}
                {!n.read && (
                  <span
                    className="h-2 w-2 rounded-full bg-[#280f91]"
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
              <span className="text-xs font-bold text-[#280f91]">
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
            <p className="mt-2 text-3xl font-black text-[#280f91]">
              50.000 VNĐ
            </p>
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
      {icon && <span className="mb-3 text-[#280f91]">{icon}</span>}
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

