import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { PortalReveal } from "./PortalReveal";
import { PortalTitle } from "./PortalTitle";
import { SpotlightCard } from "./react-bits/SpotlightCard";
import styles from "../styles/portal.module.css";

const AI_STEPS = [
  { title: "Chọn buổi học", body: "Lấy nội dung từ bản ghi Zoom của lớp." },
  { title: "Xem lại nội dung", body: "Gia sư kiểm tra và bổ sung phần cần ôn tập." },
  { title: "Tạo tài liệu", body: "Xem, chỉnh sửa rồi xuất bản cho học viên." },
] as const;

export function LmsAIFeaturesSection() {
  return (
    <section aria-labelledby="lms-ai-headline" className="bg-background px-5 pb-16 sm:px-8 sm:pb-24">
      <SpotlightCard className={`mx-auto max-w-7xl p-6 sm:p-10 lg:p-14 ${styles.aiPanel}`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <PortalReveal>
            <span className="inline-flex rounded-lg bg-accent px-3 py-2 text-xs font-bold text-accent-foreground">BeeWise AI</span>
            <PortalTitle id="lms-ai-headline" primary="Chuẩn bị tài liệu " accent="từ buổi học." className="mt-5 max-w-xl text-[clamp(2rem,3.5vw,3rem)]" />
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">BeeWise AI hỗ trợ tóm tắt bài học và tạo bài tập. Gia sư xem lại nội dung trước khi gửi cho lớp.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-primary">Tóm tắt bài học</span>
              <span className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-primary">Bài tập ôn luyện</span>
            </div>
            <Button asChild className="group mt-8 h-12 rounded-xl px-5 transition-all active:scale-[0.98]">
              <Link href="/login">Đăng nhập <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </PortalReveal>
          <ol className="relative space-y-4" aria-label="Cách gia sư chuẩn bị tài liệu với AI">
            {AI_STEPS.map((step, index) => (
              <li key={step.title}>
                <PortalReveal delay={index * 0.12} from="right" className={`relative rounded-2xl border border-border bg-background p-5 sm:p-6 ${index === 1 ? "sm:ml-8" : ""}`}>
                  <div className="flex items-start gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-mono text-sm font-semibold text-primary-foreground">{index + 1}</span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </PortalReveal>
              </li>
            ))}
          </ol>
        </div>
      </SpotlightCard>
    </section>
  );
}
