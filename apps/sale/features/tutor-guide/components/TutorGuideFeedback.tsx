import { QuotesIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";

interface TutorFeedbackItem {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  avatarClassName: string;
  rating: number;
  quote: string;
  sessions: string;
}

const TUTOR_FEEDBACKS = [
  {
    id: "1",
    name: "Thầy Nguyễn Hoàng Anh",
    subject: "Gia sư Toán, 4 năm kinh nghiệm",
    avatar: "HA",
    avatarClassName: "bg-accent text-primary",
    rating: 5,
    quote:
      "Trước đây mình phải đăng bài khắp nơi, mất cả tuần mới tìm được 1 lớp. Từ khi dùng BeeWise, học viên chủ động tìm đến mình dựa trên hồ sơ đã xác thực. Tiết kiệm rất nhiều công sức.",
    sessions: "38 buổi mỗi tháng",
  },
  {
    id: "2",
    name: "Cô Trần Mai Linh",
    subject: "Gia sư Tiếng Anh, 6 năm kinh nghiệm",
    avatar: "ML",
    avatarClassName: "bg-secondary text-white",
    rating: 5,
    quote:
      "Học viên được ghép qua AI thực sự phù hợp với phương pháp dạy của mình. Không còn cảnh học thử rồi nghỉ nữa. Lịch dạy ổn định hơn, thu nhập cũng đoán trước được.",
    sessions: "22 buổi mỗi tháng",
  },
  {
    id: "3",
    name: "Thầy Lê Minh Tuấn",
    subject: "Gia sư Vật lý, giáo viên THPT",
    avatar: "MT",
    avatarClassName: "bg-primary text-white",
    rating: 5,
    quote:
      "Phụ huynh đọc hồ sơ xong là tin ngay, không cần mất thời gian giới thiệu bản thân lại từ đầu. Quy trình xác thực bằng cấp của BeeWise tạo ra sự khác biệt rất lớn so với các nền tảng khác.",
    sessions: "16 buổi mỗi tháng",
  },
  {
    id: "4",
    name: "Cô Phạm Thu Hà",
    subject: "Gia sư Hóa học, thủ khoa ĐH KHTN",
    avatar: "TH",
    avatarClassName: "bg-highlight text-primary",
    rating: 5,
    quote:
      "Có lần học viên đột ngột xin nghỉ giữa chừng, mình không biết xử lý thế nào. Đội ngũ BeeWise hỗ trợ ngay trong ngày, giải quyết ổn thỏa cho cả hai bên. Rất chuyên nghiệp.",
    sessions: "28 buổi mỗi tháng",
  },
] satisfies TutorFeedbackItem[];

const CARD_LAYOUT_CLASSES = [
  "md:col-span-2 lg:col-span-5 lg:row-span-2 lg:min-h-[34rem]",
  "md:col-span-1 lg:col-span-7 lg:min-h-[16rem]",
  "md:col-span-1 lg:col-span-4 lg:min-h-[17rem]",
  "md:col-span-2 lg:col-span-3 lg:min-h-[17rem]",
] as const;

const CARD_TONE_CLASSES = [
  "border-primary bg-primary text-primary-foreground",
  "border-primary/10 bg-white text-foreground",
  "border-primary/10 bg-white text-foreground",
  "border-accent bg-accent text-accent-foreground",
] as const;

export function TutorGuideFeedback() {
  return (
    <section
      className="relative overflow-hidden bg-[#f8f7ff] py-20 sm:py-28"
      id="tutor-feedback"
      aria-labelledby="tutor-feedback-heading"
    >
      <div
        className="pointer-events-none absolute -left-20 top-28 h-52 w-52 rounded-full bg-secondary/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2
            id="tutor-feedback-heading"
            className="font-nunito text-3xl font-black leading-[1.08] tracking-[-0.025em] text-primary sm:text-4xl lg:text-5xl"
          >
            Được tin tưởng bởi
            <span className="mt-1 block text-foreground">
              cộng đồng gia sư BeeWise
            </span>
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-7 text-foreground/65 sm:text-lg">
            Những chia sẻ từ gia sư đang xây dựng hồ sơ, nhận lớp và giảng dạy
            trên nền tảng mỗi ngày.
          </p>
        </header>

        <ul
          className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-12"
          aria-label="Chia sẻ từ gia sư BeeWise"
        >
          {TUTOR_FEEDBACKS.map((feedback, index) => {
            const isFeatured = index === 0;
            const hasDarkSurface = isFeatured;

            return (
              <li
                key={feedback.id}
                className={`flex w-[84vw] shrink-0 snap-center flex-col rounded-[2rem] border p-6 shadow-[0_18px_50px_rgba(40,15,145,0.09)] sm:w-[26rem] sm:p-7 md:w-auto md:shrink ${CARD_LAYOUT_CLASSES[index]} ${CARD_TONE_CLASSES[index]}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <QuotesIcon
                    size={isFeatured ? 38 : 28}
                    weight="fill"
                    className={
                      hasDarkSurface ? "text-accent" : "text-primary/22"
                    }
                    aria-hidden="true"
                  />
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                      hasDarkSurface
                        ? "bg-white/12 text-white"
                        : "bg-primary/7 text-primary"
                    }`}
                    aria-label={`${feedback.rating} trên 5 sao`}
                  >
                    <StarIcon
                      size={14}
                      weight="fill"
                      className="text-accent"
                      aria-hidden="true"
                    />
                    {feedback.rating}.0
                  </div>
                </div>

                <blockquote
                  className={`mt-6 font-google-sans font-semibold leading-relaxed ${
                    isFeatured
                      ? "text-lg text-white sm:text-xl lg:text-2xl"
                      : "text-base"
                  }`}
                >
                  &ldquo;{feedback.quote}&rdquo;
                </blockquote>

                <footer
                  className={`mt-auto border-t pt-7 ${
                    hasDarkSurface
                      ? "border-white/15"
                      : "border-primary/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-nunito text-sm font-black ${feedback.avatarClassName}`}
                      aria-hidden="true"
                    >
                      {feedback.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-nunito text-sm font-extrabold leading-5">
                        {feedback.name}
                      </p>
                      <p
                        className={`mt-0.5 text-xs leading-5 ${
                          hasDarkSurface
                            ? "text-white/65"
                            : "text-foreground/58"
                        }`}
                      >
                        {feedback.subject}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-5 flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-xs ${
                      hasDarkSurface
                        ? "bg-white/10 text-white/70"
                        : "bg-primary/5 text-foreground/60"
                    }`}
                  >
                    <span>Lịch dạy trung bình</span>
                    <strong
                      className={
                        hasDarkSurface ? "text-white" : "text-primary"
                      }
                    >
                      {feedback.sessions}
                    </strong>
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
