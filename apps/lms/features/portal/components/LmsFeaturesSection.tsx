"use client";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import {
  VideoCamera,
  CalendarBlank,
  Robot,
  ChartLineUp,
  ChatTeardropDots,
  CurrencyDollar,
} from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: CalendarBlank,
    title: "Quản lý Lịch giảng dạy",
    desc: "Tạo, sửa lịch, quản lý thời khóa biểu hàng tuần và gửi lời nhắc tự động tới học viên.",
    color: "#280f91",
    bg: "#280f91",
  },
  {
    icon: VideoCamera,
    title: "Lớp học ảo tương tác",
    desc: "Giao diện học trực tuyến mượt mà, tích hợp chia sẻ màn hình, bảng trắng và giơ tay.",
    color: "#0c0c0b",
    bg: "#ffc500",
  },
  {
    icon: ChartLineUp,
    title: "Theo dõi Tiến độ",
    desc: "Thống kê bài tập, đánh giá mức độ hoàn thành và tạo báo cáo hàng tháng dễ dàng.",
    color: "#280f91",
    bg: "#280f91",
  },
  {
    icon: ChatTeardropDots,
    title: "Nhắn tin nội bộ",
    desc: "Kênh giao tiếp trực tiếp giữa gia sư và học viên mà không cần dùng ứng dụng ngoài.",
    color: "#0c0c0b",
    bg: "#ffc500",
  },
  {
    icon: CurrencyDollar,
    title: "Quản lý Thu nhập",
    desc: "Kiểm tra ví điện tử, lịch sử thanh toán các buổi học và yêu cầu rút tiền.",
    color: "#280f91",
    bg: "#280f91",
  },
  {
    icon: Robot,
    title: "Tự động chấm điểm",
    desc: "Trợ lý AI hỗ trợ gia sư tạo bài kiểm tra nhanh và tự động tổng hợp kết quả.",
    color: "#0c0c0b",
    bg: "#ffc500",
  },
];

export function LmsFeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-14"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[#0c0c0b] mb-4"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
          >
            Trang bị đầy đủ<br />
            <span className="text-[#280f91]">công cụ làm việc</span>
          </h2>
          <p className="text-[#0c0c0b]/60 text-base leading-relaxed">
            Hỗ trợ tối đa việc quản lý lớp học ảo để bạn có thể tập trung hoàn toàn vào chất lượng giảng dạy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            const isAccent = feat.bg === "#ffc500";
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`rounded-2xl p-6 flex flex-col gap-4 ${
                  isAccent
                    ? "bg-[#ffc500] shadow-lg shadow-[#ffc500]/30"
                    : "bg-[#280f91] shadow-lg shadow-[#280f91]/20"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isAccent ? "bg-[#0c0c0b]/10" : "bg-white/10"
                  }`}
                >
                  <Icon
                    size={22}
                    weight="fill"
                    className={isAccent ? "text-[#0c0c0b]" : "text-white"}
                  />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold mb-2 ${isAccent ? "text-[#0c0c0b]" : "text-white"}`}
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {feat.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isAccent ? "text-[#0c0c0b]/70" : "text-white/70"}`}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
