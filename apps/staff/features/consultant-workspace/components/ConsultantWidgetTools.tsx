"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  CalendarBlank,
  CalendarCheck,
  CalendarPlus,
  Check,
  CheckCircle,
  CircleNotch,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Info,
  MapPin,
  Receipt,
  Sparkle,
  VideoCamera,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  connectionWidgetsService,
  type ClassConfirmation,
  type CreateTrialSession,
} from "@workspace/core/services/connection-widgets.service";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";

type Tab = "trial" | "confirmation" | "payment" | "sessions";

const TAB_ITEMS = [
  { value: "trial" as const, label: "Học thử", icon: GraduationCap },
  { value: "confirmation" as const, label: "Xác nhận lớp", icon: FileText },
  { value: "payment" as const, label: "Thanh toán", icon: Receipt },
  { value: "sessions" as const, label: "Xếp lịch", icon: CalendarCheck },
];

export function ConsultantWidgetTools({
  roomId,
  onSent,
}: {
  roomId: string;
  onSent: () => void;
}) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("trial");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Trial form states
  const [subject, setSubject] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [teachingMode, setTeachingMode] = useState<"ONLINE" | "OFFLINE">(
    "ONLINE",
  );
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  // Confirmation form states
  const [confirmationId, setConfirmationId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [offeringId, setOfferingId] = useState("");
  const [classMode, setClassMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [duration, setDuration] = useState("60");
  const [sessions, setSessions] = useState("1");
  const [schedule, setSchedule] = useState("");

  const trials = useQuery({
    queryKey: ["consultant-workspace", "trials", roomId],
    queryFn: () => connectionWidgetsService.listTrials(roomId),
    enabled: tab === "confirmation",
    refetchInterval: 15_000,
  });

  const confirmations = useQuery({
    queryKey: ["consultant-workspace", "confirmations", roomId],
    queryFn: () => connectionWidgetsService.listClassConfirmations(roomId),
    enabled: tab === "confirmation",
    refetchInterval: 15_000,
  });

  const selected: ClassConfirmation | undefined = confirmations.data?.find(
    (item) => item.id === confirmationId,
  );

  function chooseConfirmation(id: string) {
    setConfirmationId(id);
    const item = confirmations.data?.find((candidate) => candidate.id === id);
    if (!item) return;
    setSubjectId(item.subjectId ?? "");
    setOfferingId(item.tutorOfferingId ?? "");
    setClassMode(item.teachingMode === "OFFLINE" ? "OFFLINE" : "ONLINE");
    setDuration(String(item.sessionDurationMinutes ?? 60));
    setSessions(String(item.numberOfSessions ?? 1));
    setSchedule(item.proposedSchedule ?? "");
  }

  async function createTrial(event: FormEvent) {
    event.preventDefault();
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (
      !subject.trim() ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start <= new Date() ||
      end <= start
    ) {
      setError(
        "Hãy nhập môn học và chọn thời gian học thử trong tương lai (giờ kết thúc phải sau giờ bắt đầu).",
      );
      return;
    }
    if (!location.trim()) {
      setError(
        teachingMode === "ONLINE"
          ? "Hãy nhập liên kết hoặc thông tin phòng học trực tuyến."
          : "Hãy nhập địa điểm học trực tiếp.",
      );
      return;
    }
    const input: CreateTrialSession = {
      subject: subject.trim(),
      scheduledStartAt: start.toISOString(),
      scheduledEndAt: end.toISOString(),
      teachingMode,
      locationOrMeetingInfo: location.trim(),
      zoomUrl:
        teachingMode === "ONLINE" && /^https?:\/\//i.test(location.trim())
          ? location.trim()
          : null,
      note: note.trim() || null,
    };
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await connectionWidgetsService.createTrial(roomId, input);
      await queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "trials", roomId],
      });
      onSent();
      setSubject("");
      setStartAt("");
      setEndAt("");
      setLocation("");
      setNote("");
      setSuccess("Đã gửi đề xuất học thử vào phòng chat.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function completeTrial(id: string, version: number) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await connectionWidgetsService.completeTrial(id, version);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["consultant-workspace", "trials", roomId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["consultant-workspace", "confirmations", roomId],
        }),
      ]);
      onSent();
      setSuccess("Đã hoàn thành học thử. Bản điều khoản lớp đã được tạo.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function updateConfirmation(event: FormEvent) {
    event.preventDefault();
    if (!selected || selected.version === undefined) return;
    const minutes = Number(duration);
    const count = Number(sessions);
    if (
      !z.uuid().safeParse(subjectId.trim()).success ||
      !z.uuid().safeParse(offeringId.trim()).success ||
      !Number.isInteger(minutes) ||
      minutes <= 0 ||
      !Number.isInteger(count) ||
      count <= 0
    ) {
      setError(
        "Hãy nhập mã UUID hợp lệ của môn học và gói giảng dạy, cùng thời lượng và số buổi học.",
      );
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await connectionWidgetsService.updateClassConfirmation(selected.id, {
        subjectId: subjectId.trim(),
        tutorOfferingId: offeringId.trim(),
        teachingMode: classMode,
        sessionDurationMinutes: minutes,
        numberOfSessions: count,
        proposedSchedule: schedule.trim(),
        expectedVersion: selected.version,
      });
      await queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "confirmations", roomId],
      });
      onSent();
      setConfirmationId("");
      setSuccess("Đã cập nhật điều khoản lớp để Gia sư và Học viên xác nhận.");
    } catch (caught) {
      setError(getApiErrorMessage(caught));
      await queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "confirmations", roomId],
      });
      setConfirmationId("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Segmented Tab Bar */}
      <div
        className="flex flex-wrap gap-1 rounded-xl border border-border bg-background p-1"
        role="tablist"
        aria-label="Loại widget hỗ trợ"
      >
        {TAB_ITEMS.map(({ value, label, icon: TabIcon }) => {
          const isActive = tab === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setTab(value);
                setError("");
                setSuccess("");
              }}
              className={`flex flex-1 min-w-[100px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-nunito font-extrabold transition-all cursor-pointer ${
                isActive
                  ? "bg-card text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              <TabIcon
                size={15}
                weight={isActive ? "bold" : "regular"}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Học thử */}
      {tab === "trial" && (
        <form
          onSubmit={(event) => void createTrial(event)}
          className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-2xs"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Môn học <span className="text-destructive">*</span>
              </label>
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Ví dụ: Toán lớp 10, IELTS Speaking..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Hình thức giảng dạy
              </label>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setTeachingMode("ONLINE")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    teachingMode === "ONLINE"
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <VideoCamera size={13} weight="bold" /> Trực tuyến
                </button>
                <button
                  type="button"
                  onClick={() => setTeachingMode("OFFLINE")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    teachingMode === "OFFLINE"
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin size={13} weight="bold" /> Trực tiếp
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </label>
              <DateTimePicker
                value={startAt}
                onChange={setStartAt}
                placeholder="dd/mm/yyyy hh:mm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Thời gian kết thúc <span className="text-destructive">*</span>
              </label>
              <DateTimePicker
                value={endAt}
                onChange={setEndAt}
                placeholder="dd/mm/yyyy hh:mm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground">
                {teachingMode === "ONLINE"
                  ? "Liên kết phòng học hoặc thông tin tham gia"
                  : "Địa điểm học trực tiếp"}{" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={
                  teachingMode === "ONLINE"
                    ? "VD: https://zoom.us/j/... hoặc Google Meet link"
                    : "VD: 123 Nguyễn Văn Cừ, Quận 5, TP.HCM"
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground">
                Ghi chú thêm (tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder="Nội dung cần chuẩn bị trước buổi học thử..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {busy ? (
                <>
                  <CircleNotch size={14} className="animate-spin" />
                  <span>Đang gửi đề xuất...</span>
                </>
              ) : (
                <>
                  <span>Gửi đề xuất học thử vào phòng chat</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Xác nhận lớp */}
      {tab === "confirmation" && (
        <div className="space-y-3.5">
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
            <Info
              size={16}
              weight="bold"
              className="shrink-0 mt-0.5 text-primary"
            />
            <span className="leading-relaxed">
              Sau khi hai bên xác nhận và buổi học thử kết thúc, nhấn{" "}
              <strong>Hoàn thành</strong> bên dưới để tạo bản điều khoản lớp.
              Sau đó cập nhật thông tin để gửi hai bên xác nhận chính thức.
            </span>
          </div>

          {/* Trials awaiting completion */}
          {trials.isPending && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 py-2">
              <CircleNotch size={14} className="animate-spin text-primary" />
              <span>Đang kiểm tra lịch học thử...</span>
            </p>
          )}

          {trials.error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <WarningCircle
                size={15}
                weight="bold"
                className="shrink-0 mt-0.5"
              />
              <span>{getApiErrorMessage(trials.error)}</span>
            </div>
          )}

          {trials.data
            ?.filter(
              (item) =>
                item.status === "CONFIRMED" &&
                !!item.scheduledEndAt &&
                new Date(item.scheduledEndAt).getTime() <= trials.dataUpdatedAt,
            )
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">
                    {item.subject ?? "Buổi học thử"}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Đã kết thúc lúc:{" "}
                    {new Date(item.scheduledEndAt!).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busy || item.version === undefined}
                  onClick={() => void completeTrial(item.id, item.version!)}
                  className="shrink-0 flex items-center gap-1 rounded-xl border border-secondary/40 bg-secondary/10 px-3 py-1.5 font-nunito font-extrabold text-xs text-secondary hover:bg-secondary/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Check size={13} weight="bold" />
                  <span>Hoàn thành học thử</span>
                </button>
              </div>
            ))}

          {/* Select confirmation */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Chọn bản điều khoản lớp học
            </label>
            <select
              value={confirmationId}
              onChange={(event) => chooseConfirmation(event.target.value)}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
            >
              <option value="">-- Chọn bản điều khoản cần cập nhật --</option>
              {confirmations.data
                ?.filter((item) => !item.classId && item.status !== "CANCELLED")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.subjectName || item.id.slice(0, 8)} · Phiên bản v
                    {item.version ?? 0} ({item.status ?? "DRAFT"})
                  </option>
                ))}
            </select>
          </div>

          {confirmations.isPending && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 py-1">
              <CircleNotch size={14} className="animate-spin text-primary" />
              <span>Đang tải danh sách điều khoản...</span>
            </p>
          )}

          {confirmations.error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <WarningCircle
                size={15}
                weight="bold"
                className="shrink-0 mt-0.5"
              />
              <span>{getApiErrorMessage(confirmations.error)}</span>
            </div>
          )}

          {/* Form update confirmation */}
          {selected && (
            <form
              onSubmit={(event) => void updateConfirmation(event)}
              className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-2xs"
            >
              <h4 className="font-nunito text-xs font-extrabold text-foreground border-b border-border pb-2">
                Chi tiết điều khoản lớp học (
                {selected.subjectName || selected.id.slice(0, 8)})
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Mã môn học (Subject UUID){" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={subjectId}
                    onChange={(event) => setSubjectId(event.target.value)}
                    placeholder="VD: a1b2c3d4-..."
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Mã gói giảng dạy (Offering UUID){" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={offeringId}
                    onChange={(event) => setOfferingId(event.target.value)}
                    placeholder="VD: e5f6a7b8-..."
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Hình thức lớp học
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setClassMode("ONLINE")}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        classMode === "ONLINE"
                          ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <VideoCamera size={13} weight="bold" /> Trực tuyến
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassMode("OFFLINE")}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        classMode === "OFFLINE"
                          ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <MapPin size={13} weight="bold" /> Trực tiếp
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Thời lượng mỗi buổi (phút){" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Tổng số buổi học <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={sessions}
                    onChange={(event) => setSessions(event.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Lịch học dự kiến
                  </label>
                  <input
                    value={schedule}
                    onChange={(event) => setSchedule(event.target.value)}
                    placeholder="VD: Thứ 2 - 4 - 6 từ 19h00 đến 20h30"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                * Học phí mỗi giờ sẽ được tự động tính toán theo gói giảng dạy.
                Khi lưu cập nhật, trạng thái xác nhận của hai bên sẽ được thiết
                lập lại.
              </p>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {busy ? (
                    <>
                      <CircleNotch size={14} className="animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} weight="bold" />
                      <span>Cập nhật điều khoản lớp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab: Thanh toán (Hướng dẫn) */}
      {tab === "payment" && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-2xs text-xs">
          <div className="flex items-center gap-2 font-nunito font-extrabold text-foreground">
            <Receipt size={16} weight="bold" className="text-primary" />
            <span>Quy trình thanh toán lớp học</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Khi Gia sư và Học viên cùng duyệt điều khoản lớp, hệ thống sẽ tự
            động tạo lớp học và hiển thị widget yêu cầu thanh toán trong phòng
            chat.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
            <li>
              Học viên nhấn nút &ldquo;Lấy liên kết thanh toán&rdquo; hoặc thanh
              toán ngay qua cổng PayOS.
            </li>
            <li>
              Sau khi giao dịch thành công, trạng thái sẽ tự động chuyển sang{" "}
              <strong>Đã thanh toán</strong> (PAID).
            </li>
          </ul>
        </div>
      )}

      {/* Tab: Xếp lịch (Hướng dẫn) */}
      {tab === "sessions" && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-2xs text-xs">
          <div className="flex items-center gap-2 font-nunito font-extrabold text-foreground">
            <CalendarCheck size={16} weight="bold" className="text-primary" />
            <span>Quy trình xếp lịch buổi học</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Sau khi lớp học được thanh toán và chuyển sang trạng thái{" "}
            <strong>ACTIVE</strong>, Gia sư có thể tự xếp lịch chi tiết từng
            buổi học trực tiếp trên widget trong chat.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
            <li>
              Hệ thống tự động kiểm tra trùng lịch của cả Gia sư và Học viên
              trước khi xếp.
            </li>
            <li>
              Các buổi học đã tạo sẽ hiển thị ngay trên timeline của cả hai bên.
            </li>
          </ul>
        </div>
      )}

      {/* Thông báo lỗi & thành công */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
        >
          <WarningCircle size={15} weight="bold" className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary"
        >
          <CheckCircle size={15} weight="fill" className="shrink-0 mt-0.5" />
          <span className="font-semibold">{success}</span>
        </div>
      )}
    </div>
  );
}
