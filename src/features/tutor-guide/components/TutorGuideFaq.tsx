"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

const FAQS = [
  {
    id: "fee",
    question: "BeeWise có thu phí nhận lớp không?",
    answer:
      "Không. Bạn không phải đóng phí nhận lớp trước. BeeWise áp dụng cơ chế hoa hồng rõ ràng trên từng buổi học.",
  },
  {
    id: "student",
    question: "Tôi là sinh viên có thể đăng ký làm gia sư không?",
    answer:
      "Có. Sinh viên, giáo viên và người có chuyên môn đều có thể đăng ký nếu đáp ứng các tiêu chí xác thực của BeeWise.",
  },
  {
    id: "trial",
    question: "Tôi có được dạy thử không?",
    answer:
      "BeeWise hỗ trợ buổi học thử theo chính sách của nền tảng để học viên và gia sư có cơ hội đánh giá mức độ phù hợp trước khi bắt đầu lớp học chính thức.",
  },
  {
    id: "rejected",
    question: "Nếu hồ sơ chưa được duyệt thì sao?",
    answer:
      "Bạn sẽ nhận được phản hồi từ đội ngũ BeeWise để bổ sung hoặc chỉnh sửa thông tin trước khi gửi xét duyệt lại.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        id={`faq-btn-${id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span
          className="text-sm sm:text-base text-foreground font-semibold leading-snug group-hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {question}
        </span>
        <CaretDownIcon
          size={18}
          className={`text-primary shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-foreground/65 leading-relaxed max-w-[60ch]">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function TutorGuideFaq() {
  const [openId, setOpenId] = useState<string>("fee");

  return (
    <section
      className="py-20 sm:py-24 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 mb-12 text-center">
          <h2
            id="faq-heading"
            className="tracking-tight leading-tight text-foreground"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            }}
          >
            Câu hỏi thường gặp
          </h2>
          <p className="text-foreground/55 text-sm sm:text-base mx-auto max-w-[42ch]">
            Những thắc mắc phổ biến nhất từ gia sư khi đăng ký tham gia BeeWise.
          </p>
        </div>

        <div className="rounded-3xl border border-border px-6 sm:px-8 divide-y-0">
          {FAQS.map((faq) => (
            <FaqItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? "" : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
