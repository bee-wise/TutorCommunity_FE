"use client";

import Image from "next/image";
import {
  Sparkle,
  ShieldCheck,
  ChatCircleDots,
  CalendarCheck,
  CheckCircle,
  MagnifyingGlass,
  PaperPlaneTilt,
  Clock,
  Star,
  Check,
  FileText,
  VideoCamera,
} from "@phosphor-icons/react";

interface ShowcaseItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  icon: React.ElementType;
  iconColor: string;
  accentBg: string;
  mockupTitle: string;
  renderMockup: () => React.ReactNode;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "ai-search",
    tag: "Beewise AI",
    tagColor: "bg-purple-500/10 text-purple-600 border-purple-200",
    title: "AI Gợi Ý Gia Sư Phù Hợp",
    subtitle: "Tìm đúng gia sư cho từng mục tiêu học tập",
    description:
      "Thay vì phải đăng bài trên các trang mạng xã hội, hệ thống AI của BeeWise phân tích sâu nhu cầu học tập, trình độ hiện tại, khu vực và ngân sách để đề xuất những gia sư tối ưu nhất.",
    benefits: [
      "Kết nối nhanh chóng chỉ sau 30 giây",
      "Độ tương thích mục tiêu lên đến 98%",
      "Gợi ý dựa trên đánh giá thực tế của học viên",
    ],
    icon: Sparkle,
    iconColor: "text-purple-600",
    accentBg: "from-purple-500/10 via-indigo-500/5 to-transparent",
    mockupTitle: "Tìm kiếm bằng AI",
    renderMockup: () => (
      <div className="w-full p-2 sm:p-4 flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1787132165/%E1%BA%A2nh_ch%E1%BB%A5p_m%C3%A0n_h%C3%ACnh_2026-08-19_163746.png"
          alt="Tìm kiếm gia sư bằng AI"
          width={1200}
          height={800}
          unoptimized
          className="w-full h-auto object-contain rounded-xl shadow-xs"
        />
      </div>
    ),
  },
  {
    id: "verified-tutor",
    tag: "Đã kiểm duyệt",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    title: "Gia Sư Được Xác Thực",
    subtitle: "Hồ sơ minh bạch, uy tín tuyệt đối",
    description:
      "Mọi gia sư trên BeeWise đều phải hoàn thành quy trình xác thực đa tầng gồm kiểm tra thông tin, bằng cấp chuyên môn, chứng chỉ quốc tế và phỏng vấn trực tiếp trước khi nhận lớp.",
    benefits: [
      "100% hồ sơ được kiểm duyệt thực tế",
      "Bằng cấp, chứng chỉ rõ ràng, công khai",
      "Đánh giá chân thực từ học viên đã học",
    ],
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    accentBg: "from-emerald-500/10 via-teal-500/5 to-transparent",
    mockupTitle: "Hồ sơ kiểm duyệt • Mã GS: BW-8892",
    renderMockup: () => (
      <div className="w-full p-2 sm:p-4 flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1787294807/%E1%BA%A2nh_ch%E1%BB%A5p_m%C3%A0n_h%C3%ACnh_2026-08-21_134908.png"
          alt="Gia sư được xác thực hồ sơ"
          width={1200}
          height={800}
          unoptimized
          className="w-full h-auto object-contain rounded-xl shadow-xs"
        />
      </div>
    ),
  },
  {
    id: "live-chat",
    tag: "Tương tác trực tiếp",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-200",
    title: "Phòng Chat Hỗ Trợ",
    subtitle: "Trao đổi bảo mật",
    description:
      "Hệ thống phòng chat trực tiếp giúp phụ huynh, học viên và gia sư dễ dàng trao đổi mục tiêu học tập, gửi bài tập và tài liệu học tập ngay trên nền tảng mà không lo rò rỉ thông tin cá nhân.",
    benefits: [
      "Trao đổi trực tiếp, phản hồi nhanh chóng",
      "Gửi tài liệu, đề thi và hình ảnh bài tập tiện lợi",
      "Bảo mật thông tin cá nhân tối đa",
    ],
    icon: ChatCircleDots,
    iconColor: "text-amber-600",
    accentBg: "from-amber-500/10 via-orange-500/5 to-transparent",
    mockupTitle: "Phòng chat • Gia sư & Học viên",
    renderMockup: () => (
      <div className="w-full flex flex-col gap-3 p-5 sm:p-7">
        {/* Chat Message 1 (Learner) */}
        <div className="flex items-end gap-2.5 justify-end">
          <div className="max-w-[82%] px-4 py-2.5 rounded-2xl rounded-br-xs bg-primary text-primary-foreground text-xs sm:text-sm leading-relaxed shadow-xs">
            Em chào cô Mai Linh ạ! Em muốn tìm gia sư kèm môn Toán 12 vào tối
            Thứ 3 và Thứ 6.
          </div>
        </div>

        {/* Chat Message 2 (Tutor) */}
        <div className="flex items-end gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/30 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-border">
            ML
          </div>
          <div className="max-w-[82%] px-4 py-2.5 rounded-2xl rounded-bl-xs bg-white border border-border text-foreground text-xs sm:text-sm leading-relaxed shadow-xs">
            Chào em nhé! Lịch tối T3 và T6 cô đang trống. Em muốn tập trung vào
            phần Hàm số hay Hình học trước để cô chuẩn bị giáo án? 📚
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="flex items-center gap-2 mt-2 px-3.5 py-2.5 rounded-xl bg-white border border-border shadow-xs">
          <span className="text-xs text-foreground/45 flex-1">
            Nhập tin nhắn trao đổi...
          </span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 hover:bg-primary/90 transition-colors"
          >
            <PaperPlaneTilt size={14} weight="fill" />
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "schedule-management",
    tag: "Linh hoạt",
    tagColor: "bg-blue-500/10 text-blue-600 border-blue-200",
    title: "Lịch Học & Nhắc Nhở Tự Động",
    subtitle: "Chủ động thời gian, không bỏ lỡ buổi học",
    description:
      "Dễ dàng xem trước lịch rảnh của gia sư trong tuần, đăng ký buổi học thử và nhận thông báo nhắc nhở tự động trước mỗi ca dạy để việc học luôn đúng lộ trình.",
    benefits: [
      "Xem lịch trống theo thời gian thực",
      "Thông báo nhắc nhở trước mỗi buổi học",
      "Linh hoạt điều chỉnh lịch học khi cần",
    ],
    icon: CalendarCheck,
    iconColor: "text-blue-600",
    accentBg: "from-blue-500/10 via-indigo-500/5 to-transparent",
    mockupTitle: "Thời khóa biểu • Lịch học tuần này",
    renderMockup: () => (
      <div className="w-full flex flex-col gap-3.5 p-5 sm:p-7">
        {/* Upcoming class card */}
        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Buổi học sắp diễn ra
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
              Tối nay
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-sm font-bold text-foreground">
                Toán 12 • Luyện Đề Số 4
              </p>
              <div className="flex items-center gap-2 text-xs text-foreground/65 mt-0.5">
                <Clock size={14} className="text-primary" />
                <span>19:30 - 21:00 • Với Thầy Hoàng Nam</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs">
              Vào lớp
            </span>
          </div>
        </div>

        {/* Weekly Slot Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { day: "Thứ 2", time: "19:00", active: false, label: "Trống" },
            { day: "Thứ 4", time: "19:30", active: true, label: "Đã đặt" },
            { day: "Thứ 6", time: "19:30", active: true, label: "Đã đặt" },
            { day: "Chủ nhật", time: "09:00", active: false, label: "Trống" },
          ].map((slot, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                slot.active
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                  : "bg-white text-foreground/70 border-border hover:border-primary/40"
              }`}
            >
              <div className="text-[11px] uppercase opacity-90">{slot.day}</div>
              <div className="text-xs font-bold mt-0.5">{slot.time}</div>
              <div
                className={`text-[10px] mt-1 font-semibold ${
                  slot.active ? "text-accent" : "text-foreground/45"
                }`}
              >
                {slot.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function FeatureShowcaseSection() {
  return (
    <section
      className="bg-background py-16 sm:py-24 relative overflow-hidden"
      id="features-showcase"
      aria-labelledby="features-showcase-headline"
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-24 flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            Trải nghiệm nền tảng
          </span>

          <h2
            id="features-showcase-headline"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-primary leading-tight font-nunito"
          >
            BeeWise cung cấp các tính năng giúp bạn <br />
            <span className="text-accent">kết nối & học tập</span>
          </h2>

          <p className="text-foreground/65 text-base sm:text-lg max-w-2xl leading-relaxed">
            Thiết kế trực quan, dễ thao tác và đồng bộ - giúp phụ huynh, học
            viên và gia sư kết nối an toàn, minh bạch và hiệu quả nhất.
          </p>
        </div>

        {/* Zigzag Showcase Rows */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {SHOWCASE_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 1; // Reverse order for zigzag

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                {/* Content Side (5 cols) */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border w-fit">
                    <Icon size={16} weight="fill" className={item.iconColor} />
                    <span className={item.tagColor}>{item.tag}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-foreground uppercase font-nunito leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-primary font-nunito">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-sm sm:text-[15px] text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bullet Benefits */}
                  <div className="space-y-2.5 pt-2">
                    {item.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Check size={12} weight="bold" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-foreground/80">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mockup Image / Visual Window Side (7 cols - Focus on Image) */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="group rounded-3xl sm:rounded-[2.5rem] bg-card border border-border/80 p-2 sm:p-3 shadow-md hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                    <div
                      className={`rounded-2xl sm:rounded-[2rem] border border-border/70 overflow-hidden bg-gradient-to-b ${item.accentBg}`}
                    >
                      {/* Window Controls Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-white/75 backdrop-blur-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="text-[11px] font-medium text-foreground/45 font-mono truncate max-w-[200px] sm:max-w-none">
                          {item.mockupTitle}
                        </span>
                      </div>

                      {/* Mockup Body Content */}
                      <div className="min-h-[240px] sm:min-h-[280px] flex items-center justify-center">
                        {item.renderMockup()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
