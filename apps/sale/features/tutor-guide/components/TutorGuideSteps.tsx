import {
  CheckCircleIcon,
  PlayIcon,
  SparkleIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react/dist/ssr";

const STEPS = [
  {
    title: "Hoàn thiện hồ sơ",
    body: "Chia sẻ môn dạy, kinh nghiệm, khu vực, lịch trống và cách bạn tổ chức một buổi học.",
  },
  {
    title: "Tải lên giấy tờ",
    body: "Gửi giấy tờ cần thiết để đội ngũ BeeWise kiểm tra và phản hồi nếu cần bổ sung.",
  },
  {
    title: "Phỏng vấn cùng trợ lý Beewise AI",
    body: "Hoàn thành buổi phỏng vấn ngắn với trợ lý AI để chia sẻ chi tiết về chuyên môn và phong cách giảng dạy.",
  },
  {
    title: "Trở thành Gia sư",
    body: "Sau khi hồ sơ và phỏng vấn được duyệt, bạn đã có thể nhận các yêu cầu kết nối phù hợp.",
  },
];

export function TutorGuideSteps() {
  return (
    <section
      id="how-to-register"
      className="relative overflow-hidden bg-[#f8f7ff] py-20 sm:py-28"
      aria-labelledby="steps-heading"
    >
      <div
        className="pointer-events-none absolute -left-16 top-24 h-40 w-40 rounded-full bg-accent/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-16 h-56 w-56 rounded-full bg-secondary/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-2">
        <div className="relative">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
                Lộ trình dành cho gia sư mới
              </div>
              <h2
                id="steps-heading"
                className="font-nunito uppercase text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
              >
                Từ hồ sơ đến lớp học đầu tiên
              </h2>
              <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-foreground/60">
                Bốn bước rõ ràng, có hướng dẫn ở từng chặng để bạn tự tin bắt
                đầu hành trình cùng BeeWise.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e7f1ea] px-4 py-2 text-sm font-semibold text-secondary">
              <CheckCircleIcon size={18} weight="fill" aria-hidden="true" />
              Đăng ký miễn phí · Có đội ngũ đồng hành
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:items-stretch lg:gap-8">
            <div className="rounded-[2.5rem] border border-primary/10 bg-white p-3 shadow-[0_24px_70px_rgba(40,15,145,0.12)] sm:p-4">
              <div
                className="relative flex aspect-[4/3] overflow-hidden rounded-[2rem] bg-primary text-white sm:aspect-video"
                role="img"
                aria-label="Khung video hướng dẫn các bước trở thành gia sư BeeWise đang được chuẩn bị"
              >
                <div
                  className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-accent/90"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-secondary/70"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex w-full flex-col justify-between p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                      <VideoCameraIcon
                        size={17}
                        weight="fill"
                        aria-hidden="true"
                      />
                      Video hướng dẫn
                    </span>
                    <span className="rounded-full bg-accent px-3 py-2 text-xs font-extrabold text-accent-foreground">
                      Sắp ra mắt
                    </span>
                  </div>

                  <div className="mx-auto flex max-w-md flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-white/20 bg-white text-primary shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:h-24 sm:w-24 sm:border-[6px]">
                      <PlayIcon
                        size={30}
                        weight="fill"
                        className="translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-nunito mt-3 text-base font-extrabold sm:mt-5 sm:text-2xl">
                      Xem hướng dẫn trở thành gia sư Beewise
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-white/70">
                    <span>00:00</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                      <span className="block h-full w-[18%] rounded-full bg-accent" />
                    </span>
                    <span>03:30</span>
                  </div>
                </div>
              </div>
            </div>

            <ol
              className="rounded-[2.5rem] border border-primary/10 bg-white px-5 py-3 shadow-[0_20px_60px_rgba(40,15,145,0.08)] sm:px-7 sm:py-4"
              aria-label="Quy trình đăng ký gia sư"
            >
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="group relative grid grid-cols-[auto_1fr] gap-4 border-b border-primary/10 py-5 last:border-b-0 sm:gap-5 sm:py-6"
                >
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0edff] font-nunito text-sm font-black text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="font-google-sans text-lg font-extrabold leading-snug text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
