"use client";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { UserCirclePlus, MagnifyingGlass, CalendarCheck, BookOpen, VideoCamera, ChartLineUp } from "@phosphor-icons/react";

const STEPS = [
  {
    step: "01",
    icon: UserCirclePlus,
    title: "Đăng nhập Cổng",
    desc: "Đăng nhập vào hệ thống bằng tài khoản BeeWise của bạn để truy cập bảng điều khiển.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Kiểm tra Lịch trình",
    desc: "Xem nhanh các lớp học sắp tới, bài tập đến hạn và tin nhắn chưa đọc trong ngày.",
  },
  {
    step: "03",
    icon: VideoCamera,
    title: "Tham gia Lớp học",
    desc: "Vào phòng học ảo trực tiếp từ lịch, với đầy đủ tài liệu đã được chuẩn bị sẵn.",
  },
  {
    step: "04",
    icon: ChartLineUp,
    title: "Cập nhật Tiến độ",
    desc: "Hoàn thành bài học, cập nhật trạng thái bài tập và xem báo cáo hiệu suất sau buổi.",
  },
];

export function LmsHowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[#0c0c0b] mb-4"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
          >
            Làm quen hệ thống trong{" "}
            <span className="text-[#ffc500] relative">
              4 bước
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#ffc500] rounded-full" />
            </span>
          </h2>
          <p className="text-[#0c0c0b]/60 text-base leading-relaxed">
            Quy trình vận hành chuẩn giúp bạn thao tác nhanh chóng và không bỏ sót công việc.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[52px] left-[17%] right-[17%] h-[2px] bg-[#280f91]/10" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-[104px] h-[104px] rounded-3xl bg-[#280f91] flex items-center justify-center shadow-lg shadow-[#280f91]/25 relative z-10">
                    <Icon size={38} weight="fill" className="text-white" />
                  </div>
                  <span
                    className="absolute -top-3 -right-3 bg-[#ffc500] text-[#0c0c0b] text-[11px] font-black rounded-xl px-2 py-1 z-20"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3
                  className="text-base font-bold text-[#0c0c0b] mb-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#0c0c0b]/60 leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <a
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#280f91] px-8 text-sm font-bold text-white hover:bg-[#1f0c73] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#280f91]/30"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Bắt đầu ngay hôm nay
          </a>
        </motion.div>
      </div>
    </section>
  );
}
