"use client";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

export function LmsIntroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" className="py-24 lg:py-32 bg-[#280f91] overflow-hidden relative">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#ffc500]/10 blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-6"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Không gian số cho<br />
              <span className="text-[#ffc500]">việc dạy & học</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-[480px]">
              Tất cả các công cụ cần thiết để tổ chức lớp học, giao tiếp và đánh giá kết quả đều được tích hợp trong một giao diện duy nhất, tối ưu cho năng suất.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Bảng điều khiển chung", desc: "Tổng quan lịch trình và công việc" },
                { label: "Phòng học trực tuyến", desc: "Bảng trắng, chia sẻ tài liệu" },
                { label: "Kho lưu trữ", desc: "Tài liệu học tập được tổ chức gọn gàng" },
                { label: "Báo cáo tự động", desc: "Thống kê giờ học và điểm số" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white text-sm font-bold mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>{item.label}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: image / visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative h-[400px] lg:h-[480px] w-full rounded-3xl overflow-hidden">
              <Image
                src="https://picsum.photos/seed/beewise-intro-tutor/800/600"
                alt="BeeWise LMS - Giới thiệu"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#280f91]/40 to-transparent" />
            </div>
            {/* Accent bar */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-24 rounded-full bg-[#ffc500]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
