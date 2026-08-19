"use client";

import Image from "next/image";
import { Star, ChatCircle } from "@phosphor-icons/react";

interface FeedbackItem {
  id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  rating: number;
  comment: string;
}

const FEEDBACK_LIST: FeedbackItem[] = [
  {
    id: "1",
    name: "Chị Thu Hà",
    role: "Phụ huynh",
    subject: "Toán lớp 9 ôn thi vào 10",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Nhờ tìm gia sư qua AI mà bé nhà mình tìm được cô giáo rất hợp tính. Sau 2 tháng điểm kiểm tra môn Toán tăng từ 6.5 lên 8.5!",
  },
  {
    id: "2",
    name: "Minh Quân",
    role: "Học viên",
    subject: "Luyện thi IELTS 7.0",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Tính năng AI tóm tắt bài học cực kỳ tiện, học xong có ngay tài liệu ôn lại. Thầy giáo nhiệt tình và hướng dẫn phát âm rất chuẩn.",
  },
  {
    id: "3",
    name: "Anh Hoàng Nam",
    role: "Phụ huynh",
    subject: "Tiếng Anh lớp 6",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Giao diện dễ dùng, chỉ mất chưa đầy 1 phút là hệ thống gợi ý đúng gia sư gần nhà. Hồ sơ gia sư minh bạch nên gia đình rất yên tâm.",
  },
  {
    id: "4",
    name: "Thảo Vy",
    role: "Học viên",
    subject: "Hóa học lớp 11",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Trước đây mình sợ môn Hóa lắm, nhờ chị gia sư kiên nhẫn giảng lại từ gốc mà giờ mình tự tin làm hết các bài tập nâng cao trên lớp.",
  },
];

export function FeedbackSection() {
  return (
    <section
      className="bg-background py-16 sm:py-24 relative overflow-hidden"
      id="feedback"
      aria-labelledby="feedback-headline"
    >
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <ChatCircle size={16} weight="fill" />
            Đánh giá từ người dùng
          </span>

          <h2
            id="feedback-headline"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-foreground leading-tight font-nunito"
          >
            Học viên & Phụ huynh{" "}
            <span className="text-primary">nói gì về BeeWise?</span>
          </h2>

          <p className="text-foreground/65 text-base sm:text-lg max-w-2xl leading-relaxed">
            Những trải nghiệm thực tế từ cộng đồng học viên và phụ huynh đã tin
            tưởng đồng hành cùng BeeWise.
          </p>
        </div>

        {/* 4 Cards in 1 Row on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEEDBACK_LIST.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300 group relative"
            >
              {/* Rating stars */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={16} weight="fill" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {item.role}
                  </span>
                </div>

                {/* Feedback content in quotes */}
                <p className="text-foreground/80 text-sm sm:text-[15px] leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3.5 pt-6 mt-4 border-t border-border/60">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate font-nunito">
                    {item.name}
                  </h3>
                  <p className="text-xs text-foreground/55 truncate mt-0.5 font-medium">
                    {item.subject}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
