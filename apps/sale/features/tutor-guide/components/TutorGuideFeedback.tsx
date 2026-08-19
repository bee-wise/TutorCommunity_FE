"use client";

import { Star, Quotes } from "@phosphor-icons/react";

const TUTOR_FEEDBACKS = [
  {
    id: "1",
    name: "Thầy Nguyễn Hoàng Anh",
    subject: "Gia sư Toán • 4 năm kinh nghiệm",
    avatar: "HA",
    avatarBg: "bg-blue-500",
    rating: 5,
    highlight: "Không còn mất thời gian tìm lớp",
    quote:
      "Trước đây mình phải đăng bài khắp nơi, mất cả tuần mới tìm được 1 lớp. Từ khi dùng BeeWise, học viên chủ động tìm đến mình dựa trên hồ sơ đã xác thực. Tiết kiệm rất nhiều công sức.",
    sessions: "38 buổi dạy / tháng",
    income: "12.000.000đ / tháng",
  },
  {
    id: "2",
    name: "Cô Trần Mai Linh",
    subject: "Gia sư Tiếng Anh • 6 năm kinh nghiệm",
    avatar: "ML",
    avatarBg: "bg-emerald-500",
    rating: 5,
    quote:
      "Học viên được ghép qua AI thực sự phù hợp với phương pháp dạy của mình. Không còn cảnh học thử rồi nghỉ nữa. Lịch dạy ổn định hơn, thu nhập cũng đoán trước được.",
    sessions: "22 buổi dạy / tháng",
    income: "8.800.000đ / tháng",
  },
  {
    id: "3",
    name: "Thầy Lê Minh Tuấn",
    subject: "Gia sư Lý • Giáo viên THPT",
    avatar: "MT",
    avatarBg: "bg-violet-500",
    rating: 5,
    quote:
      "Phụ huynh đọc hồ sơ xong là tin ngay, không cần mất thời gian giới thiệu bản thân lại từ đầu. Quy trình xác thực bằng cấp của BeeWise tạo ra sự khác biệt rất lớn so với các nền tảng khác.",
    sessions: "16 buổi dạy / tháng",
    income: "7.200.000đ / tháng",
  },
  {
    id: "4",
    name: "Cô Phạm Thu Hà",
    subject: "Gia sư Hóa • Thủ khoa ĐH KHTN",
    avatar: "TH",
    avatarBg: "bg-rose-500",
    rating: 5,
    quote:
      "Có lần học viên đột ngột xin nghỉ giữa chừng, mình không biết xử lý thế nào. Đội ngũ BeeWise hỗ trợ ngay trong ngày, giải quyết ổn thỏa cho cả hai bên. Rất chuyên nghiệp.",
    sessions: "28 buổi dạy / tháng",
    income: "9.600.000đ / tháng",
  },
];

export function TutorGuideFeedback() {
  return (
    <section
      className="py-16 sm:py-24 bg-muted/40 relative overflow-hidden"
      id="tutor-feedback"
      aria-labelledby="tutor-feedback-heading"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            Gia sư nói gì về BeeWise
          </span>

          <h2
            id="tutor-feedback-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black uppercase text-primary leading-tight font-nunito"
          >
            Được tin tưởng bởi{" "}
            <span className="text-accent">hàng trăm gia sư</span>
          </h2>

          <p className="text-foreground/65 text-base sm:text-lg max-w-2xl leading-relaxed">
            Không phải lời quảng cáo — đây là những chia sẻ thật từ các gia sư
            đang hoạt động trên nền tảng BeeWise mỗi ngày.
          </p>
        </div>

        {/* Featured card (first, large) + 3 cards in grid */}
        <div className="flex flex-col gap-5">
          {/* Featured top card */}
          <div className="group relative rounded-3xl bg-primary p-8 sm:p-10 lg:p-12 overflow-hidden border border-primary/20">
            {/* bg pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,197,0,0.5) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center">
              {/* Quote */}
              <div className="flex-1">
                <Quotes
                  size={40}
                  weight="fill"
                  className="text-accent/60 mb-4"
                />
                <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-foreground leading-relaxed italic max-w-[52ch]">
                  &ldquo;{TUTOR_FEEDBACKS[0].quote}&rdquo;
                </blockquote>
              </div>

              {/* Author info + stats */}
              <div className="flex flex-col gap-5 lg:min-w-[260px] shrink-0">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${TUTOR_FEEDBACKS[0].avatarBg} flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg`}
                  >
                    {TUTOR_FEEDBACKS[0].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-base text-primary-foreground font-nunito">
                      {TUTOR_FEEDBACKS[0].name}
                    </p>
                    <p className="text-sm text-primary-foreground/65 mt-0.5">
                      {TUTOR_FEEDBACKS[0].subject}
                    </p>
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: TUTOR_FEEDBACKS[0].rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            size={13}
                            weight="fill"
                            className="text-accent"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                    <p className="text-xs text-primary-foreground/60 font-medium">
                      Lịch dạy
                    </p>
                    <p className="text-sm font-bold text-primary-foreground mt-0.5">
                      {TUTOR_FEEDBACKS[0].sessions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TUTOR_FEEDBACKS.slice(1).map((fb) => (
              <div
                key={fb.id}
                className="group flex flex-col gap-5 p-6 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Quote icon */}
                <Quotes size={24} weight="fill" className="text-primary/20" />

                {/* Quote text */}
                <blockquote className="text-sm text-foreground/75 leading-relaxed italic flex-1">
                  &ldquo;{fb.quote}&rdquo;
                </blockquote>

                {/* Divider */}
                <div className="border-t border-border/60 pt-4 flex flex-col gap-3">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        weight="fill"
                        className="text-amber-500"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${fb.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0`}
                    >
                      {fb.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground font-nunito truncate">
                        {fb.name}
                      </p>
                      <p className="text-xs text-foreground/55 truncate mt-0.5">
                        {fb.subject}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
