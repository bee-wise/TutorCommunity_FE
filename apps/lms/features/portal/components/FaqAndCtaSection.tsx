"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

const FAQ_ITEMS = [
  {
    question: "BeeWise LMS dành cho ai?",
    answer:
      "LMS dành cho học viên và gia sư đã kết nối thành công qua BeeWise. Mỗi vai trò có một không gian riêng phù hợp với công việc cần thực hiện.",
  },
  {
    question: "Làm thế nào để bắt đầu sử dụng?",
    answer:
      "Sau khi gia sư và học viên thống nhất lớp học, Consultant xác nhận kết nối. Hệ thống sẽ tạo lớp và cấp quyền LMS cho cả hai bên.",
  },
  {
    question: "Tài liệu và tiến độ được quản lý như thế nào?",
    answer:
      "Tài liệu được lưu theo từng lớp và buổi học. Lịch sử buổi học, trạng thái hoàn thành và thông tin liên quan được cập nhật trong cùng một không gian.",
  },
  {
    question: "Thông tin lớp học có được bảo mật không?",
    answer:
      "BeeWise giới hạn quyền truy cập theo vai trò và theo lớp. Chỉ những người tham gia được cấp quyền mới có thể xem nội dung liên quan.",
  },
] as const;

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-[#f1eef8] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:px-8">
        <div>
          <p className="text-sm font-extrabold text-[#280f91]">
            Câu hỏi thường gặp
          </p>
          <h2
            className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#17141b] sm:text-4xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Bạn còn thắc mắc?
          </h2>
          <p className="mt-5 text-base leading-7 text-[#37333d]/65">
            Thông tin ngắn gọn về quyền truy cập, vận hành lớp học và dữ liệu
            trên LMS.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white px-5 sm:px-7">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="border-b border-[#280f91]/9 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-[#17141b]">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="shrink-0 text-[#280f91]"
                  >
                    <CaretDown size={18} weight="bold" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion ? undefined : { height: 0, opacity: 0 }
                      }
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-sm leading-6 text-[#37333d]/65 sm:text-base sm:leading-7">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#fbfaf7] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#280f91] px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2
            className="mx-auto max-w-3xl text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Dạy và học ngay tại BeeWise LMS
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/72">
            Đăng nhập để xem lịch học, tài liệu và tiến độ lớp của bạn trên
            BeeWise LMS.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-[#ffc500] px-7 text-sm font-extrabold text-[#201a00] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#280f91]"
          >
            Đăng nhập LMS
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#280f91]/8 bg-[#fbfaf7] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative size-8 overflow-hidden rounded-lg bg-[#280f91]/8">
            <Image
              src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
              alt=""
              fill
              sizes="32px"
              className="object-contain p-1"
            />
          </span>
          <p className="text-xs text-[#37333d]/50">
            © {new Date().getFullYear()} BeeWise Education
          </p>
        </div>
        <div className="flex gap-5 text-xs font-semibold text-[#37333d]/55">
          <a href="#" className="hover:text-[#280f91]">
            Điều khoản
          </a>
          <a href="#" className="hover:text-[#280f91]">
            Bảo mật
          </a>
        </div>
      </div>
    </footer>
  );
}

export function FaqAndCtaSection() {
  return (
    <>
      <FaqSection />
      <FinalCta />
      <Footer />
    </>
  );
}
