import type { ReactNode } from "react";
import Image from "next/image";
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { interviewPanelClass } from "./InterviewUi";

type Tone = "success" | "waiting" | "warning";

const cloudinary = "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_560";
const toneConfig: Record<Tone, { Icon: typeof ClockIcon; label: string; badge: string; mascot: string }> = {
  success: { Icon: CheckCircleIcon, label: "Hoàn tất", badge: "bg-secondary text-secondary-foreground", mascot: "v1789966161/20.png" },
  waiting: { Icon: ClockIcon, label: "Đang chờ xét duyệt", badge: "bg-accent text-accent-foreground", mascot: "v1789966153/8.png" },
  warning: { Icon: ExclamationCircleIcon, label: "Cần lưu ý", badge: "bg-highlight text-accent-foreground", mascot: "v1790760176/bee-flower.png" },
};

export function InterviewResult({ title, message, tone = "waiting", children }: {
  title: string; message: string; tone?: Tone; children?: ReactNode;
}) {
  const { Icon, label, badge, mascot } = toneConfig[tone];
  return <section className={`${interviewPanelClass} grid overflow-hidden md:grid-cols-[minmax(0,1fr)_280px]`}>
    <div className="flex flex-col items-start px-5 py-7 sm:px-8 sm:py-9">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${badge}`}>
        <Icon aria-hidden="true" className="size-4 shrink-0" />{label}
      </span>
      <h2 className="mt-5 font-nunito text-2xl font-extrabold leading-[1.15] sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{message}</p>
      {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
    </div>
    <div className="flex items-center justify-center bg-muted px-6 py-6 md:py-0">
      <Image
        src={`${cloudinary}/${mascot}`}
        alt=""
        width={280}
        height={280}
        className="h-auto w-40 md:w-56"
      />
    </div>
  </section>;
}
