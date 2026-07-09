"use client";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Star, ShieldCheck, Trophy, Handshake } from "@phosphor-icons/react";
import Image from "next/image";

const BENEFITS = [
  {
    icon: Star,
    title: "Tối ưu hóa Thời gian",
    desc: "Mọi tác vụ quản lý từ xếp lịch, giao bài tập đến chấm điểm đều được tự động hóa, giúp bạn tập trung vào chuyên môn.",
  },
  {
    icon: ShieldCheck,
    title: "Đồng bộ Dữ liệu Tức thời",
    desc: "Lịch học, tin nhắn và thông báo được đồng bộ real-time giữa gia sư và học viên, không độ trễ.",
  },
  {
    icon: Trophy,
    title: "Kiểm soát Chất lượng",
    desc: "Báo cáo chi tiết hiệu suất học tập sau mỗi khóa học, giúp điều chỉnh phương pháp kịp thời.",
  },
  {
    icon: Handshake,
    title: "Bảo mật & Riêng tư",
    desc: "Tài liệu học tập và thông tin cá nhân của người dùng được mã hóa bảo mật cấp độ cao.",
  },
];

export function LmsBenefitsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="benefits" className="py-24 lg:py-32 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" ref={ref}>
          {/* Left: benefits list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[#0c0c0b] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Vận hành lớp học<br />
              <span className="text-[#280f91]">chuyên nghiệp</span>
            </h2>
            <p className="text-[#0c0c0b]/60 text-base leading-relaxed mb-10">
              Không còn tình trạng quản lý lịch học rời rạc hay thất lạc tài liệu, mọi thứ quy về một mối.
            </p>

            <div className="flex flex-col gap-7">
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#280f91] flex items-center justify-center shrink-0">
                      <Icon size={20} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-base font-bold text-[#0c0c0b] mb-1"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-[#0c0c0b]/60 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: visual highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative h-[420px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-[#280f91]/15">
              <Image
                src="https://picsum.photos/seed/beewise-benefits-study/700/500"
                alt="BeeWise LMS - Giá trị mang lại"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#280f91]/40 via-transparent to-[#ffc500]/20" />
            </div>

            {/* Achievement card */}
            <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-[#0c0c0b]/10 border border-[#0c0c0b]/6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffc500] flex items-center justify-center shrink-0">
                  <Trophy size={20} weight="fill" className="text-[#0c0c0b]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0c0c0b]">Kết quả xuất sắc</p>
                  <p className="text-xs text-[#0c0c0b]/50">95% học viên đạt mục tiêu</p>
                </div>
              </div>
            </div>

            {/* Top accent pill */}
            <div className="absolute -top-4 left-6 bg-[#280f91] rounded-full px-4 py-2">
              <p className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-montserrat)" }}>
                Tin cậy bởi hơn 2,000 học viên
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
