"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  GraduationCap,
  ChalkboardTeacher,
  CalendarBlank,
  FolderOpen,
  CurrencyDollar,
  ChatTeardropDots,
  UploadSimple,
  Trash,
  PencilSimple,
  CheckCircle,
  Clock,
  FilePdf,
  FileDoc,
  Robot,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

type TabKey = "student" | "tutor";

/* ───────────────────────────────────────────
   Card Content Sub-Components
   ─────────────────────────────────────────── */

// Student Cards
function StudentScheduleCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Lịch tuần này
      </p>
      {[
        {
          subject: "Ielts Writing",
          time: "14:00 - 15:30",
          status: "upcoming" as const,
        },
        {
          subject: "Ielts Speaking",
          time: "09:00 - 10:30",
          status: "completed" as const,
        },
        {
          subject: "Ielts Reading",
          time: "16:00 - 17:00",
          status: "upcoming" as const,
        },
      ].map((s) => (
        <div
          key={s.subject}
          className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            {s.status === "upcoming" ? (
              <Clock size={13} weight="fill" className="text-[#ffc500]" />
            ) : (
              <CheckCircle size={13} weight="fill" className="text-[#447353]" />
            )}
            <div>
              <p className="text-[11px] font-semibold text-[#0c0c0b]">
                {s.subject}
              </p>
              <p className="text-[9px] text-[#0c0c0b]/40">{s.time}</p>
            </div>
          </div>
          <span
            className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
              s.status === "upcoming"
                ? "text-[#ffc500] bg-[#ffc500]/15"
                : "text-[#447353] bg-[#447353]/12"
            }`}
          >
            {s.status === "upcoming" ? "Sắp diễn ra" : "Đã hoàn thành"}
          </span>
        </div>
      ))}
    </div>
  );
}

function StudentDocumentsCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Tài liệu mới nhất
      </p>
      {[
        {
          name: "Chương 5 - Bài tập.pdf",
          icon: FilePdf,
          by: "Gia sư Nguyễn Văn A",
        },
        {
          name: "Slide Lý Thuyết.docx",
          icon: FileDoc,
          by: "Gia sư Trần Thị B",
        },
        { name: "Tóm tắt buổi học #28", icon: Robot, by: "Hệ thống BeeWise" },
      ].map((doc) => {
        const Icon = doc.icon;
        return (
          <div
            key={doc.name}
            className="flex items-center gap-3 bg-[#F8FAFC] rounded-lg px-3 py-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-[#280f91]/8 flex items-center justify-center shrink-0">
              <Icon size={15} weight="fill" className="text-[#280f91]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[#0c0c0b] truncate">
                {doc.name}
              </p>
              <p className="text-[9px] text-[#0c0c0b]/40">{doc.by}</p>
            </div>
            <span className="text-[8px] font-medium text-[#280f91] bg-[#280f91]/8 px-2 py-0.5 rounded-full shrink-0">
              Chỉ đọc
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StudentBillingCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Học phí tháng này
      </p>
      <div className="bg-[#F8FAFC] rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0 text-[9px] font-bold text-[#0c0c0b]/50 px-3 py-2 border-b border-[#0c0c0b]/6">
          <span>Lớp học</span>
          <span className="text-center">Buổi</span>
          <span className="text-right">Trạng thái</span>
        </div>
        {[
          { subject: "Lớp A", sessions: 8, status: "Đã thanh toán" },
          { subject: "Lớp B", sessions: 6, status: "Đã thanh toán" },
          { subject: "Lớp C", sessions: 4, status: "Chờ xác nhận" },
        ].map((row) => (
          <div
            key={row.subject}
            className="grid grid-cols-3 gap-0 text-[10px] px-3 py-2 border-b border-[#0c0c0b]/4 last:border-b-0"
          >
            <span className="font-semibold text-[#0c0c0b]">{row.subject}</span>
            <span className="text-center text-[#0c0c0b]/60">
              {row.sessions}
            </span>
            <span
              className={`text-right font-bold ${row.status === "Đã thanh toán" ? "text-[#447353]" : "text-[#ffc500]"}`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-[#280f91]/5 rounded-lg">
        <span className="text-[10px] font-bold text-[#0c0c0b]">
          Tổng buổi học
        </span>
        <span
          className="text-sm font-bold text-[#280f91]"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          18 buổi
        </span>
      </div>
      <p className="text-[8px] text-[#0c0c0b]/40 text-center">
        Học phí được hiển thị chi tiết trong hệ thống
      </p>
    </div>
  );
}

// Tutor Cards
function TutorMultiRoomCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Lớp học đang hoạt động
      </p>
      {[
        {
          name: "Nguyễn Văn Minh",
          subject: "Lớp A",
          status: "live" as const,
          unread: 3,
        },
        {
          name: "Trần Thị Hoa",
          subject: "Lớp B",
          status: "live" as const,
          unread: 1,
        },
        {
          name: "Lê Hoàng Nam",
          subject: "Lớp C",
          status: "idle" as const,
          unread: 0,
        },
      ].map((room) => (
        <div
          key={room.name}
          className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#280f91]/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#280f91]">
                  {room.name.charAt(0)}
                </span>
              </div>
              {room.status === "live" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#447353] border-2 border-white" />
              )}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#0c0c0b]">
                {room.name}
              </p>
              <p className="text-[9px] text-[#0c0c0b]/40">{room.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {room.unread > 0 && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-[#ffc500] flex items-center justify-center text-[8px] font-bold text-[#0c0c0b]">
                {room.unread}
              </span>
            )}
            <ChatTeardropDots
              size={14}
              weight="fill"
              className="text-[#280f91]/40"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TutorDocumentsCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Quản lý tài liệu
      </p>
      {[
        { name: "Bài tập buổi 6.pdf", action: "upload" as const },
        { name: "Slide bài giảng.docx", action: "edit" as const },
        { name: "Tóm tắt buổi #25.pdf", action: "delete" as const },
      ].map((doc) => (
        <div
          key={doc.name}
          className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#280f91]/8 flex items-center justify-center shrink-0">
              <FilePdf size={15} weight="fill" className="text-[#280f91]" />
            </div>
            <p className="text-[11px] font-semibold text-[#0c0c0b] truncate max-w-[140px]">
              {doc.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {doc.action === "upload" && (
              <div className="w-6 h-6 rounded-md bg-[#280f91]/10 flex items-center justify-center hover:bg-[#280f91]/20 transition-colors cursor-pointer">
                <UploadSimple
                  size={11}
                  weight="bold"
                  className="text-[#280f91]"
                />
              </div>
            )}
            {doc.action === "edit" && (
              <div className="w-6 h-6 rounded-md bg-[#ffc500]/15 flex items-center justify-center hover:bg-[#ffc500]/30 transition-colors cursor-pointer">
                <PencilSimple
                  size={11}
                  weight="bold"
                  className="text-[#0c0c0b]"
                />
              </div>
            )}
            {doc.action === "delete" && (
              <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer">
                <Trash size={11} weight="bold" className="text-red-500" />
              </div>
            )}
          </div>
        </div>
      ))}
      <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border-2 border-dashed border-[#280f91]/15 text-[10px] font-semibold text-[#280f91]/60 hover:border-[#280f91]/30 hover:text-[#280f91] transition-all">
        <UploadSimple size={12} weight="bold" />
        Tải lên tài liệu mới
      </button>
    </div>
  );
}

function TutorIncomeCard() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-[#0c0c0b]/50 mb-1">
        Thu nhập thực nhận — Tháng này
      </p>
      <div className="bg-[#F8FAFC] rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0 text-[9px] font-bold text-[#0c0c0b]/50 px-3 py-2 border-b border-[#0c0c0b]/6">
          <span>Học viên</span>
          <span className="text-center">Buổi</span>
          <span className="text-right">Trạng thái</span>
        </div>
        {[
          { name: "Nguyễn Văn Minh", sessions: 8, status: "Đã thanh toán" },
          { name: "Trần Thị Hoa", sessions: 6, status: "Đã thanh toán" },
          { name: "Lê Hoàng Nam", sessions: 4, status: "Chờ đối soát" },
        ].map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-3 gap-0 text-[10px] px-3 py-2 border-b border-[#0c0c0b]/4 last:border-b-0"
          >
            <span className="font-semibold text-[#0c0c0b]">{row.name}</span>
            <span className="text-center text-[#0c0c0b]/60">
              {row.sessions}
            </span>
            <span
              className={`text-right font-bold ${row.status === "Đã thanh toán" ? "text-[#447353]" : "text-[#ffc500]"}`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-[#447353]/8 rounded-lg">
        <span className="text-[10px] font-bold text-[#0c0c0b]">
          Tổng buổi đã dạy
        </span>
        <span
          className="text-sm font-bold text-[#447353]"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          18 buổi
        </span>
      </div>
      <div className="flex items-center gap-1.5 justify-center">
        <EyeSlash size={11} className="text-[#0c0c0b]/30" />
        <p className="text-[8px] text-[#0c0c0b]/40">
          Thu nhập chi tiết được hiển thị trong hệ thống
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Tab Card Data
   ─────────────────────────────────────────── */

interface FeatureCard {
  icon: typeof CalendarBlank;
  title: string;
  desc: string;
  content: React.ReactNode;
}

const STUDENT_CARDS: FeatureCard[] = [
  {
    icon: CalendarBlank,
    title: "Quản Lý Lịch Học",
    desc: "Xem lịch trình, trạng thái buổi học và đếm ngược thời gian.",
    content: <StudentScheduleCard />,
  },
  {
    icon: FolderOpen,
    title: "Kho Tài Liệu Tập Trung",
    desc: "Truy cập tài liệu do gia sư chia sẻ theo từng lớp học.",
    content: <StudentDocumentsCard />,
  },
  {
    icon: CurrencyDollar,
    title: "Theo Dõi Học Phí",
    desc: "Xem số buổi học và trạng thái thanh toán theo từng lớp.",
    content: <StudentBillingCard />,
  },
];

const TUTOR_CARDS: FeatureCard[] = [
  {
    icon: ChatTeardropDots,
    title: "Quản Lý Lớp Học Đa Nhiệm",
    desc: "Điều phối nhiều lớp học cùng lúc trong không gian làm việc.",
    content: <TutorMultiRoomCard />,
  },
  {
    icon: FolderOpen,
    title: "Kho Tài Liệu Toàn Quyền",
    desc: "Tải lên, chỉnh sửa và quản lý tài liệu riêng cho từng lớp.",
    content: <TutorDocumentsCard />,
  },
  {
    icon: CurrencyDollar,
    title: "Theo Dõi Thu Nhập",
    desc: "Xem số buổi đã dạy và trạng thái thanh toán từ học viên.",
    content: <TutorIncomeCard />,
  },
];

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */

export function DualRoleFeatureGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>("student");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cards = activeTab === "student" ? STUDENT_CARDS : TUTOR_CARDS;

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] leading-tight tracking-tight text-[#0c0c0b] mb-4"
            style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 800 }}
          >
            <span className="text-[#280f91]">Mang lại giá trị riêng cho</span>
            <br />
            Gia Sư và Học Viên <br />
          </h2>
          <p className="text-[#0c0c0b]/60 text-base leading-relaxed">
            Mỗi vai trò có không gian riêng — được thiết kế cho đúng công việc
            cần làm sau khi kết nối thành công.
          </p>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="flex items-center justify-center mb-10"
        >
          <div className="relative inline-flex items-center bg-[#F8FAFC] rounded-xl p-1 border border-[#0c0c0b]/6">
            {(
              [
                {
                  key: "student" as TabKey,
                  label: "Góc Nhìn Học Viên",
                  icon: GraduationCap,
                },
                {
                  key: "tutor" as TabKey,
                  label: "Không Gian Gia Sư",
                  icon: ChalkboardTeacher,
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-[#0c0c0b]/60 hover:text-[#0c0c0b]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 bg-[#280f91] rounded-lg shadow-lg shadow-[#280f91]/25"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} weight="fill" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Feature cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease }}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.25 },
                  }}
                  className="group rounded-2xl p-5 bg-white/95 md:bg-white/60 md:backdrop-blur-md border border-[#280f91]/8 shadow-sm hover:shadow-xl hover:shadow-[#280f91]/8 transition-shadow duration-300"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#280f91]/8 flex items-center justify-center group-hover:bg-[#280f91] transition-colors duration-250">
                      <Icon
                        size={20}
                        weight="fill"
                        className="text-[#280f91] group-hover:text-white transition-colors duration-250"
                      />
                    </div>
                    <div>
                      <h3
                        className="text-sm font-bold text-[#0c0c0b]"
                        style={{ fontFamily: "var(--font-nunito-family)" }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-[10px] text-[#0c0c0b]/50 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="mt-2">{card.content}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
