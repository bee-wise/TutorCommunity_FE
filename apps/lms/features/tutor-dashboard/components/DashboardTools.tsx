import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DASHBOARD_ASSETS } from "../data/dashboard.assets";
import { DashboardLink } from "./DashboardLink";

const TOOLS = [
  { title: "Quản lý lớp học", description: "Theo dõi lớp và điểm danh buổi học", href: "/lms/tutor/classes" },
  { title: "Thu nhập & thanh toán", description: "Tra cứu thu nhập, theo dõi quyết toán", href: "/lms/tutor/earnings" },
  { title: "Chat kết nối & tư vấn", description: "Trao đổi trước khi vào lớp và nhận hỗ trợ", href: "/lms/tutor/messages" },
] as const;

export function DashboardTools() {
  return (
    <section className="space-y-5" aria-label="Công cụ giảng dạy">
      <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-accent/10 p-5 text-accent-foreground">
        <Image src={DASHBOARD_ASSETS.beeWand} alt="" width={120} height={120} unoptimized aria-hidden="true" className="pointer-events-none absolute -right-2 top-2 h-24 w-auto" />
        <div className="flex items-center gap-2 text-sm font-bold"><SparklesIcon className="size-4" aria-hidden="true" />BeeWise AI</div>
        <h2 className="relative mt-3 font-lms text-lg font-extrabold leading-snug">Chuẩn bị bài học nhẹ nhàng hơn</h2>
        <p className="relative mt-2 max-w-[75%] text-sm leading-relaxed">Tạo tài liệu từ nội dung buổi học, xem lại và chỉnh sửa trước khi xuất bản.</p>
        <DashboardLink href="/lms/tutor/classes" className="mt-5">Chọn lớp soạn tài liệu</DashboardLink>
      </div>
      <div>
        <h2 className="font-lms text-sm font-extrabold leading-[1.3] text-foreground">Công việc giảng dạy</h2>
        <div className="mt-3 divide-y divide-border">
          {TOOLS.map(({ title, description, href }) => <Button key={href} asChild variant="ghost" className="h-auto min-h-16 w-full justify-start whitespace-normal rounded-xl px-2 py-3 transition-all hover:bg-muted active:scale-[0.98] motion-reduce:transform-none">
            <Link href={href}>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-primary">{title}</span>
                <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{description}</span>
              </span>
              <ArrowRightIcon className="size-4 text-primary" aria-hidden="true" />
            </Link>
          </Button>)}
        </div>
      </div>
    </section>
  );
}
