"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon as ArrowLeft,
  ArrowTopRightOnSquareIcon as ArrowSquareOut,
  ArrowPathIcon as ArrowsCounterClockwise,
  CalendarDaysIcon as CalendarCheck,
  CalendarDaysIcon as CalendarPlus,
  CheckIcon as Check,
  CheckCircleIcon as CheckCircle,
  ArrowPathIcon as CircleNotch,
  ClockIcon as Clock,
  CreditCardIcon as CreditCard,
  DocumentTextIcon as FileText,
  AcademicCapIcon as GraduationCap,
  PaperAirplaneIcon as PaperPlaneTilt,
  ReceiptPercentIcon as Receipt,
  VideoCameraIcon as VideoCamera,
} from "@heroicons/react/24/outline";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";

type FlowStep = 1 | 2 | 3 | 4;

export function TVCChatDemoScreen() {
  const [step, setStep] = useState<FlowStep>(1);
  const [trialConfirmed, setTrialConfirmed] = useState(false);
  const [classConfirmed, setClassConfirmed] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [customMessages, setCustomMessages] = useState<
    Array<{ id: string; text: string; time: string }>
  >([]);
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSessionsForm, setShowSessionsForm] = useState(false);
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [step, trialConfirmed, classConfirmed, isPaid, customMessages]);

  const handleConfirmTrial = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTrialConfirmed(true);
      setIsProcessing(false);
      if (step === 1) setStep(2);
    }, 500);
  };

  const handleConfirmClass = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setClassConfirmed(true);
      setIsProcessing(false);
      if (step === 2) setStep(3);
    }, 500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
      if (step === 3) setStep(4);
    }, 500);
  };

  const handleReset = () => {
    setStep(1);
    setTrialConfirmed(false);
    setClassConfirmed(false);
    setIsPaid(false);
    setCustomMessages([]);
  };

  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setCustomMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text: inputVal.trim(), time: timeStr },
    ]);
    setInputVal("");
  };

  const quickPills = [
    "Dạ em đã nhận được thông tin!",
    "Em đồng ý với lịch học này ạ.",
    "Cảm ơn thầy và BeeWise hỗ trợ!",
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* ── Chat Room Header ───────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/learner/messages"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary lg:hidden"
            aria-label="Quay lại"
          >
            <ArrowLeft width={18} height={18} />
          </Link>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-nunito font-black text-sm text-primary-foreground shadow-2xs">
              MĐ
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card ring-2 ring-card"
              title="Đã xác minh"
            >
              <CheckCircle width={14} height={14} className="text-secondary" />
            </span>
          </div>

          {/* Name & Role */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-nunito font-extrabold text-sm sm:text-base text-foreground">
                Thầy Trần Minh Đức
              </h1>
              <span className="shrink-0 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary border border-secondary/25">
                Gia sư Chuyên Toán
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              Toán 12 Nâng cao · Tư vấn viên: Thu Trang (BeeWise)
            </p>
          </div>
        </div>

        {/* Status indicator & reset button */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span>Đang trực tuyến</span>
          </span>

          <button
            type="button"
            onClick={handleReset}
            title="Làm mới hội thoại"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
          >
            <ArrowsCounterClockwise width={15} height={15} />
          </button>
        </div>
      </header>

      {/* ── Chat Messages Scroll Area ──────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-background/50">
        {/* Timestamp Divider */}
        <div className="flex justify-center" role="separator">
          <span className="rounded-full border border-border bg-card px-3 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-2xs">
            Hôm nay 09:00
          </span>
        </div>

        {/* ── GIAI ĐOẠN 1: ĐỀ XUẤT HỌC THỬ ──────────────────── */}
        {/* Consultant Message */}
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground mt-0.5">
            TT
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-xs font-bold text-foreground">
                Thu Trang
              </span>
              <span className="text-[10px] text-muted-foreground">· Tư vấn viên</span>
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
              Chào bạn! Mình là Thu Trang từ BeeWise. Mình thấy bạn quan tâm đến lớp <strong>Toán 12 Ôn thi THPT Quốc Gia</strong> của thầy Trần Minh Đức. Mình đã gửi bạn đề xuất buổi học thử miễn phí bên dưới nhé!
            </div>
          </div>
        </div>

        {/* Tutor Message */}
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground mt-0.5">
            MĐ
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-xs font-bold text-foreground">
                Thầy Trần Minh Đức
              </span>
              <span className="text-[10px] text-muted-foreground">· Gia sư</span>
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
              Chào em, thầy đã xếp lịch học thử 45 phút để cùng kiểm tra kiến thức đầu vào và thống nhất phương pháp học nhé.
            </div>
          </div>
        </div>

        {/* ── WIDGET 1: TRIAL SESSION ───────────────────────── */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 shrink-0" />
          <div className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap width={16} height={16} />
                </div>
                <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
                  Đề xuất lịch học thử
                </h3>
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight ${
                  trialConfirmed
                    ? "bg-secondary/15 text-secondary border-secondary/30"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                }`}
              >
                {trialConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
              </span>
            </header>

            <div className="space-y-3 p-4 text-xs">
              <div className="space-y-2 border-b border-border/60 pb-3">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Môn học</span>
                  <span className="font-semibold text-foreground">
                    Toán 12 - Ôn thi THPT Quốc Gia
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Thời gian</span>
                  <span className="font-semibold text-foreground">
                    Ngày mai, 19:30 – 20:15
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Hình thức</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    <VideoCamera width={13} height={13} /> Trực tuyến qua Zoom
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Phòng học</span>
                  <span className="font-mono text-primary font-semibold">
                    meet.beewise.edu.vn/toan12-demo
                  </span>
                </div>
              </div>

              {/* Dual Confirmation indicator */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-2.5 py-1.5 text-[11px] font-medium text-secondary">
                  <CheckCircle width={14} height={14} className="shrink-0" />
                  <span>Gia sư: Đã duyệt</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium ${
                    trialConfirmed
                      ? "border-secondary/30 bg-secondary/10 text-secondary"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                  }`}
                >
                  {trialConfirmed ? (
                    <CheckCircle width={14} height={14} className="shrink-0" />
                  ) : (
                    <Clock width={14} height={14} className="shrink-0 opacity-70" />
                  )}
                  <span>Học viên: {trialConfirmed ? "Đã duyệt" : "Chờ bạn duyệt"}</span>
                </div>
              </div>

              {/* Action Button */}
              {!trialConfirmed && (
                <button
                  type="button"
                  onClick={handleConfirmTrial}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CircleNotch width={14} height={14} className="animate-spin" />
                      <span>Đang xác nhận...</span>
                    </>
                  ) : (
                    <>
                      <Check width={14} height={14} />
                      <span>Xác nhận lịch học thử</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── GIAI ĐOẠN 2: XÁC NHẬN LỚP HỌC ──────────────────── */}
        {step >= 2 && (
          <>
            {/* Learner reply */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
                <div className="flex justify-end px-1">
                  <span className="text-xs font-bold text-primary">Bạn (Học viên)</span>
                </div>
                <div className="rounded-2xl rounded-tr-sm bg-primary p-3.5 text-xs leading-relaxed text-primary-foreground shadow-2xs">
                  Em đã xác nhận lịch học thử lúc 19:30 rồi ạ! Cảm ơn thầy và BeeWise.
                </div>
              </div>
            </div>

            {/* Time Divider */}
            <div className="flex justify-center my-2" role="separator">
              <span className="rounded-full border border-border bg-card px-3 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-2xs">
                Sau buổi học thử · 20:30
              </span>
            </div>

            {/* Tutor Feedback */}
            <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground mt-0.5">
                MĐ
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-xs font-bold text-foreground">
                    Thầy Trần Minh Đức
                  </span>
                  <span className="text-[10px] text-muted-foreground">· Gia sư</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
                  Buổi học thử hôm nay rất tốt! Thầy đã soạn lộ trình 10 buổi chuyên sâu Toán 12 để bứt phá điểm số trong kỳ thi sắp tới.
                </div>
              </div>
            </div>

            {/* Consultant Class Confirmation Message */}
            <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground mt-0.5">
                TT
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-xs font-bold text-foreground">
                    Thu Trang
                  </span>
                  <span className="text-[10px] text-muted-foreground">· Tư vấn viên</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
                  BeeWise gửi bạn bản điều khoản lớp học 1-kèm-1 chính thức bên dưới. Bạn xem qua và bấm xác nhận để hệ thống tạo yêu cầu thanh toán nhé!
                </div>
              </div>
            </div>

            {/* ── WIDGET 2: CLASS CONFIRMATION ────────────────── */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 shrink-0" />
              <div className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
                <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText width={16} height={16} />
                    </div>
                    <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
                      Xác nhận điều khoản lớp học
                    </h3>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight ${
                      classConfirmed
                        ? "bg-secondary/15 text-secondary border-secondary/30"
                        : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                    }`}
                  >
                    {classConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </header>

                <div className="space-y-3 p-4 text-xs">
                  <div className="space-y-2 border-b border-border/60 pb-3">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Môn học</span>
                      <span className="font-semibold text-foreground">
                        Toán 12 Nâng cao (1-kèm-1)
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Hình thức</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-primary">
                        <VideoCamera width={13} height={13} /> Trực tuyến
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Thời lượng</span>
                      <span className="font-semibold text-foreground">
                        90 phút / buổi
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Tổng số buổi</span>
                      <span className="font-semibold text-foreground">
                        10 buổi học
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Học phí mỗi giờ</span>
                      <span className="font-semibold text-foreground">
                        250.000 ₫
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-muted-foreground">Tổng học phí</span>
                      <span className="font-nunito font-black text-primary text-sm">
                        3.750.000 ₫
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Lịch dự kiến</span>
                      <span className="font-semibold text-foreground text-right">
                        Thứ 2 - Thứ 4 - Thứ 6 (19:30 – 21:00)
                      </span>
                    </div>
                  </div>

                  {/* Dual Confirmation Indicator */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-2.5 py-1.5 text-[11px] font-medium text-secondary">
                      <CheckCircle width={14} height={14} className="shrink-0" />
                      <span>Gia sư: Đã duyệt</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium ${
                        classConfirmed
                          ? "border-secondary/30 bg-secondary/10 text-secondary"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {classConfirmed ? (
                        <CheckCircle width={14} height={14} className="shrink-0" />
                      ) : (
                        <Clock width={14} height={14} className="shrink-0 opacity-70" />
                      )}
                      <span>
                        Học viên: {classConfirmed ? "Đã duyệt" : "Chờ bạn duyệt"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!classConfirmed && (
                    <button
                      type="button"
                      onClick={handleConfirmClass}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <CircleNotch width={14} height={14} className="animate-spin" />
                          <span>Đang xác nhận...</span>
                        </>
                      ) : (
                        <>
                          <Check width={14} height={14} />
                          <span>Xác nhận điều khoản lớp học</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── GIAI ĐOẠN 3: THANH TOÁN HỌC PHÍ ────────────────── */}
        {step >= 3 && (
          <>
            {/* Learner reply */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
                <div className="flex justify-end px-1">
                  <span className="text-xs font-bold text-primary">Bạn (Học viên)</span>
                </div>
                <div className="rounded-2xl rounded-tr-sm bg-primary p-3.5 text-xs leading-relaxed text-primary-foreground shadow-2xs">
                  Em đã đọc và xác nhận điều khoản lớp học ạ!
                </div>
              </div>
            </div>

            {/* Consultant Message */}
            <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground mt-0.5">
                TT
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-xs font-bold text-foreground">
                    Thu Trang
                  </span>
                  <span className="text-[10px] text-muted-foreground">· Tư vấn viên</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
                  Tuyệt vời! Cả hai bên đã đồng ý với điều khoản. Hệ thống gửi bạn liên kết thanh toán an toàn qua PayOS để chính thức kích hoạt khóa học nhé!
                </div>
              </div>
            </div>

            {/* ── WIDGET 3: PAYMENT REQUEST ───────────────────── */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 shrink-0" />
              <div className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
                <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Receipt width={16} height={16} />
                    </div>
                    <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
                      Học viên thanh toán
                    </h3>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight ${
                      isPaid
                        ? "bg-secondary/15 text-secondary border-secondary/30"
                        : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                    }`}
                  >
                    {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                  </span>
                </header>

                <div className="space-y-3 p-4 text-xs">
                  <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Mã lớp học</span>
                      <span className="font-mono font-semibold text-foreground">
                        BW-CLASS-MATH12-09
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                      <span className="text-muted-foreground">Số tiền cần đóng</span>
                      <span className="font-nunito font-black text-primary text-sm">
                        3.750.000 ₫
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Mã đơn hàng</span>
                      <span className="font-mono text-muted-foreground font-semibold">
                        #PAYOS-882391
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Hạn thanh toán</span>
                      <span className="font-semibold text-foreground">
                        23:59 ngày 10/10/2026
                      </span>
                    </div>
                    {isPaid && (
                      <div className="flex justify-between gap-2 border-t border-border pt-2 text-secondary font-semibold">
                        <span>Đã thanh toán lúc</span>
                        <span>Vừa xong (PayOS QR)</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Button */}
                  {!isPaid && (
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-nunito font-extrabold text-xs text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-[0.98] cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <CircleNotch width={14} height={14} className="animate-spin" />
                          <span>Đang xác nhận thanh toán...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard width={15} height={15} />
                          <span>Thanh toán ngay qua PayOS</span>
                          <ArrowSquareOut width={13} height={13} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── GIAI ĐOẠN 4: LỊCH CÁC BUỔI HỌC ─────────────────── */}
        {step >= 4 && (
          <>
            {/* System Success Banner */}
            <div className="flex justify-center py-1" role="status">
              <span className="rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-center text-xs font-semibold text-secondary flex items-center gap-1.5 shadow-2xs">
                <CheckCircle width={14} height={14} />
                <span>
                  Thanh toán thành công 3.750.000 ₫ qua PayOS. Lớp học đã được kích hoạt!
                </span>
              </span>
            </div>

            {/* Tutor Scheduled Message */}
            <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground mt-0.5">
                MĐ
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-xs font-bold text-foreground">
                    Thầy Trần Minh Đức
                  </span>
                  <span className="text-[10px] text-muted-foreground">· Gia sư</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs">
                  Thầy đã lên lịch chi tiết cho 10 buổi học của chúng ta trong tháng. Em kiểm tra timeline bên dưới nhé, hẹn gặp em vào buổi học đầu tiên!
                </div>
              </div>
            </div>

            {/* ── WIDGET 4: CLASS SESSIONS ────────────────────── */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 shrink-0" />
              <div className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
                <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CalendarCheck width={16} height={16} />
                    </div>
                    <h3 className="font-nunito text-sm font-extrabold text-foreground truncate">
                      Lịch các buổi học chính thức
                    </h3>
                  </div>
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary tracking-tight">
                    10 buổi học
                  </span>
                </header>

                <div className="space-y-3 p-4 text-xs">
                  <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Mã lớp</span>
                    <span className="font-mono font-semibold text-foreground">
                      BW-CLASS-MATH12-09
                    </span>
                  </div>

                  {/* Sessions Timeline Cards */}
                  <ol className="space-y-2 pt-1">
                    {[
                      {
                        num: 1,
                        date: "Thứ 2, 12/10/2026",
                        time: "19:30 – 21:00",
                        topic: "Chuyên đề: Cực trị hàm số nâng cao",
                        room: "meet.beewise.edu.vn/toan12-01",
                      },
                      {
                        num: 2,
                        date: "Thứ 4, 14/10/2026",
                        time: "19:30 – 21:00",
                        topic: "Chuyên đề: Tiệm cận & Tương giao đồ thị",
                        room: "meet.beewise.edu.vn/toan12-01",
                      },
                      {
                        num: 3,
                        date: "Thứ 6, 16/10/2026",
                        time: "19:30 – 21:00",
                        topic: "Chuyên đề: Nguyên hàm & Tích phân từng phần",
                        room: "meet.beewise.edu.vn/toan12-01",
                      },
                      {
                        num: 4,
                        date: "Thứ 2, 19/10/2026",
                        time: "19:30 – 21:00",
                        topic: "Chuyên đề: Ứng dụng tích phân tính diện tích",
                        room: "meet.beewise.edu.vn/toan12-01",
                      },
                    ].map((session) => (
                      <li
                        key={session.num}
                        className="rounded-xl border border-border/80 bg-background p-3 text-xs transition-colors hover:border-border"
                      >
                        <div className="flex items-center justify-between gap-2 font-semibold">
                          <span className="font-nunito font-extrabold text-foreground">
                            Buổi {session.num}: {session.topic}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            Đã xếp lịch
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1 text-muted-foreground text-[11px]">
                          <Clock width={12} height={12} />
                          <span>
                            {session.date} · {session.time}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-primary font-medium truncate">
                          <VideoCamera width={12} height={12} className="shrink-0" />
                          <span className="truncate">{session.room}</span>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Button to Schedule More */}
                  <button
                    type="button"
                    onClick={() => setShowSessionsForm((v) => !v)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-card px-4 py-2 font-nunito font-bold text-xs text-primary shadow-2xs transition-all hover:bg-primary/5 hover:border-primary active:scale-[0.98] cursor-pointer"
                  >
                    {showSessionsForm ? (
                      <span>Đóng biểu mẫu xếp lịch</span>
                    ) : (
                      <>
                        <CalendarPlus width={14} height={14} />
                        <span>Xếp thêm buổi học mới</span>
                      </>
                    )}
                  </button>

                  {showSessionsForm && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setShowSessionsForm(false);
                      }}
                      className="space-y-3 rounded-xl border border-border bg-background p-3.5"
                    >
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-foreground">
                          Thời gian bắt đầu
                        </label>
                        <DateTimePicker
                          value={sessionStart}
                          onChange={setSessionStart}
                          placeholder="dd/mm/yyyy hh:mm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-foreground">
                          Thời gian kết thúc
                        </label>
                        <DateTimePicker
                          value={sessionEnd}
                          onChange={setSessionEnd}
                          placeholder="dd/mm/yyyy hh:mm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-primary py-2 text-xs font-nunito font-extrabold text-primary-foreground"
                      >
                        Thêm buổi học
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Learner Final Message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
                <div className="flex justify-end px-1">
                  <span className="text-xs font-bold text-primary">Bạn (Học viên)</span>
                </div>
                <div className="rounded-2xl rounded-tr-sm bg-primary p-3.5 text-xs leading-relaxed text-primary-foreground shadow-2xs">
                  Dạ em đã nhận được lịch học đầy đủ rồi ạ. Em cảm ơn thầy và chị Trang đã hỗ trợ rất nhiệt tình!
                </div>
              </div>
            </div>
          </>
        )}

        {/* Custom User Messages */}
        {customMessages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
              <div className="flex justify-end px-1">
                <span className="text-xs font-bold text-primary">Bạn</span>
              </div>
              <div className="rounded-2xl rounded-tr-sm bg-primary p-3.5 text-xs leading-relaxed text-primary-foreground shadow-2xs">
                {msg.text}
              </div>
              <div className="flex justify-end px-1">
                <time className="text-[10px] text-muted-foreground">{msg.time}</time>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Response Suggestions ────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border/80 bg-background/50 px-4 py-2">
        <span className="text-[11px] font-semibold text-muted-foreground mr-1">
          Gợi ý nhanh:
        </span>
        {quickPills.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => setInputVal(pill)}
            className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* ── Chat Input Footer ──────────────────────────────── */}
      <footer className="border-t border-border bg-card p-3 sm:p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập tin nhắn phản hồi của học viên..."
            className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all hover:bg-primary/95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <PaperPlaneTilt width={16} height={16} />
          </button>
        </form>
      </footer>
    </div>
  );
}
