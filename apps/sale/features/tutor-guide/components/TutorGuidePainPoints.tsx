import {
  ChatCircleTextIcon,
  CurrencyCircleDollarIcon,
  MagnifyingGlassIcon,
  ShieldWarningIcon,
} from "@phosphor-icons/react/dist/ssr";

const PAIN_POINTS = [
  {
    id: "search",
    icon: MagnifyingGlassIcon,
    title: "Tìm lớp mất nhiều thời gian",
    text: "Bài đăng trôi nhanh, nhu cầu thiếu rõ ràng và khó biết học viên có thực sự phù hợp hay không.",
  },
  {
    id: "fee",
    icon: CurrencyCircleDollarIcon,
    title: "Phí nhận lớp thiếu minh bạch",
    text: "Gia sư thường phải trả tiền trước khi có đủ thông tin để đánh giá cơ hội giảng dạy.",
  },
  {
    id: "trust",
    icon: ShieldWarningIcon,
    title: "Năng lực khó được ghi nhận",
    text: "Bằng cấp, kinh nghiệm và phương pháp dạy dễ bị thu gọn thành vài dòng giới thiệu chung chung.",
  },
  {
    id: "support",
    icon: ChatCircleTextIcon,
    title: "Thiếu người hỗ trợ khi kết nối",
    text: "Khi lịch học hoặc kỳ vọng thay đổi, gia sư thường phải tự xử lý toàn bộ trao đổi với học viên.",
  },
];

export function TutorGuidePainPoints() {
  return (
    <section
      className="bg-primary py-18 sm:py-24"
      aria-labelledby="pain-points-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="pain-points-heading"
            className="font-nunito uppercase text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl"
          >
            Không cần rải hồ sơ
          </h2>
          <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-primary-foreground/70">
            BeeWise được xây dựng từ những vướng mắc rất thật trong quá trình
            tìm học viên và duy trì một lớp học lâu dài.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-9 md:grid-cols-2">
          {PAIN_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <article
                key={point.id}
                className="grid grid-cols-[auto_1fr] gap-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon size={22} weight="bold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-google-sans text-lg font-bold text-primary-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-primary-foreground/65">
                    {point.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
