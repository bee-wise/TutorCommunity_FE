import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";

export function LearnerClassMissingState() {
  return <div className="mx-auto grid min-h-[60dvh] max-w-[1100px] place-items-center px-4 py-10 text-center">
    <div className="rounded-3xl border border-border bg-card px-6 py-10 shadow-soft">
      <h1 className="font-nunito text-xl font-extrabold text-primary">Không tìm thấy lớp học</h1>
      <p className="mt-2 text-sm text-muted-foreground">Lớp này không có trong danh sách học tập của bạn.</p>
      <Button asChild variant="outline" className="mt-5 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href="/lms/learner/classes">Về danh sách lớp</Link></Button>
    </div>
  </div>;
}
