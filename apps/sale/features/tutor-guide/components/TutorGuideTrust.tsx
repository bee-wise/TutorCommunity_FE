"use client";

import Image from "next/image";
import {
  CalendarCheck,
  ChatCircleText,
  ArrowsCounterClockwise,
  Bell,
  Lock,
  Headset,
  ShieldCheck,
} from "@phosphor-icons/react";

const TRUST_FEATURES = [
  {
    id: "schedule",
    icon: CalendarCheck,
    title: "Theo dõi lịch học rõ ràng",
    desc: "Cập nhật thời khóa biểu theo thời gian thực, dễ dàng quản lý ca học và buổi dạy trong tuần.",
    color: "text-blue-600 bg-blue-500/10 border-blue-200",
  },
  {
    id: "history",
    icon: ChatCircleText,
    title: "Quản lý lịch sử trao đổi",
    desc: "Toàn bộ thông tin bài học, tài liệu và tiến độ đều được lưu trữ tập trung, tiện tra cứu.",
    color: "text-purple-600 bg-purple-500/10 border-purple-200",
  },
  {
    id: "reconcile",
    icon: ArrowsCounterClockwise,
    title: "Đối soát thông tin minh bạch",
    desc: "Hệ thống ghi nhận số buổi dạy chuẩn xác, đảm bảo quyền lợi tài chính công bằng cho cả hai bên.",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-200",
  },
  {
    id: "notify",
    icon: Bell,
    title: "Nhắc lịch & Thông báo tự động",
    desc: "Gửi thông báo nhắc nhở trước giờ học qua hệ thống giúp bạn không bao giờ bỏ lỡ buổi học.",
    color: "text-amber-600 bg-amber-500/10 border-amber-200",
  },
  {
    id: "data",
    icon: Lock,
    title: "Lưu trữ dữ liệu an toàn",
    desc: "Mọi thông tin cá nhân và liên lạc đều được mã hóa bảo mật, chống rò rỉ dữ liệu.",
    color: "text-teal-600 bg-teal-500/10 border-teal-200",
  },
  {
    id: "support",
    icon: Headset,
    title: "Cố vấn hỗ trợ xuyên suốt",
    desc: "Đội ngũ BeeWise luôn sẵn sàng đồng hành, giải đáp thắc mắc và hỗ trợ trong mọi tình huống.",
    color: "text-rose-600 bg-rose-500/10 border-rose-200",
  },
];

export function TutorGuideTrust() {
  return (
    <section
      className="py-16 sm:py-24 bg-background relative overflow-hidden"
      aria-labelledby="trust-heading"
      id="trust-section"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            Minh bạch & An tâm
          </span>

          <h2
            id="trust-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-primary leading-tight font-nunito"
          >
            An tâm khi đồng hành{" "}
            <span className="text-accent">cùng BeeWise</span>
          </h2>

          <p className="text-foreground/65 text-base sm:text-lg max-w-2xl leading-relaxed">
            BeeWise xây dựng quy trình quản lý minh bạch để bảo vệ tối đa quyền
            lợi và tạo dựng niềm tin vững chắc cho cả gia sư và học viên.
          </p>
        </div>

        {/* 6 Cards Grid (3 cols on desktop, 2 cols on tablet, 1 col on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group p-6 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.color}`}
                  >
                    <Icon size={24} weight="fill" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="font-google-sans text-base sm:text-lg text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom cute banner with sticker illustration */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 border border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-foreground font-nunito">
              Bạn cần hỗ trợ thêm thông tin hoặc tư vấn lớp học?
            </h4>
            <p className="text-sm text-foreground/70">
              Đội ngũ cố vấn BeeWise luôn sẵn sàng giải đáp 24/7 mọi thắc mắc
              của bạn.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Image
              src="/images/Sticker/E3-1.PNG"
              alt="BeeWise Sticker"
              width={80}
              height={70}
              className="object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
