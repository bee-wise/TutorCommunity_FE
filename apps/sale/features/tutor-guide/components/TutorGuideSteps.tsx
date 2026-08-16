import Image from "next/image";
import {
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

const STEPS = [
  {
    title: "Hoàn thiện hồ sơ",
    body: "Chia sẻ môn dạy, kinh nghiệm, khu vực, lịch trống và cách bạn tổ chức một buổi học.",
  },
  {
    title: "Xác thực năng lực",
    body: "Gửi giấy tờ cần thiết để đội ngũ BeeWise kiểm tra và phản hồi nếu cần bổ sung.",
  },
  {
    title: "Chọn kết nối phù hợp",
    body: "Xem nhu cầu học tập, trao đổi cùng học viên và chỉ nhận lớp khi hai bên thống nhất.",
  },
];

export function TutorGuideSteps() {
  return (
    <section
      id="how-to-register"
      className="bg-muted py-20 sm:py-28"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <h2
              id="steps-heading"
              className="font-montserrat text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
            >
              Từ hồ sơ đến lớp học đầu tiên
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-foreground/60">
              Ba việc rõ ràng, có hướng dẫn ở từng chặng và không cần trả phí để
              nhận lớp.
            </p>
            <div className="relative mt-8 aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] bg-[#d7d8dc]">
              <Image
                src="/images/Tutor/1.png"
                alt="Gia sư trong cộng đồng BeeWise"
                fill
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          <ol className="grid gap-4" aria-label="Quy trình đăng ký gia sư">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="group grid gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/25 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
              >
                <div className="font-montserrat text-3xl font-extrabold text-primary/25">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-montserrat text-lg font-bold text-foreground">
                    <CheckCircleIcon
                      size={19}
                      weight="fill"
                      className="text-secondary"
                      aria-hidden="true"
                    />
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-foreground/60">
                    {step.body}
                  </p>
                </div>
                <ArrowRightIcon
                  size={20}
                  className="hidden text-primary/30 transition-transform group-hover:translate-x-1 sm:block"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
