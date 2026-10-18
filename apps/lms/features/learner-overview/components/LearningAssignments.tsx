import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { DashboardDetail, LearningAssignment, LearningCourse } from "../types/learner-dashboard.types";

export function LearningAssignments({ assignments, courses, onDetail }: { assignments: LearningAssignment[]; courses: LearningCourse[]; onDetail: (detail: DashboardDetail) => void }) {
  return <section aria-labelledby="learning-assignments-heading" className="space-y-4">
    <h2 id="learning-assignments-heading" className="text-lg font-extrabold">Bài tập của bạn</h2>
    <div role="region" aria-label="Bảng bài tập, có thể cuộn ngang" tabIndex={0} className="relative overflow-x-auto rounded-3xl border border-border bg-card shadow-soft focus-visible:outline-2 focus-visible:outline-ring">
      <table className="w-full min-w-[520px] text-left text-xs">
        <caption className="sr-only">Bài tập, hạn nộp, trạng thái và kết quả trong báo cáo minh họa</caption>
        <thead className="border-b border-border text-muted-foreground"><tr><th scope="col" className="px-5 py-4 font-medium">Bài tập</th><th scope="col" className="px-3 py-4 font-medium">Hạn nộp</th><th scope="col" className="px-3 py-4 font-medium">Trạng thái</th><th scope="col" className="px-4 py-4"><span className="sr-only">Chi tiết</span></th></tr></thead>
        <tbody className="divide-y divide-border">{assignments.map((item) => {
          const course = courses.find((course) => course.id === item.courseId);
          const label = item.status === "pending" ? "Cần hoàn thành" : item.status === "submitted" ? "Chờ nhận xét" : "Đã chấm";
          return <tr key={item.id} className="transition-colors hover:bg-muted/50"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary"><DocumentTextIcon className="size-4" aria-hidden="true" /></span><div><p className="font-bold leading-5">{item.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{course?.subject} · {course?.tutor}</p></div></div></td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground tabular-nums">{item.due}</td><td className="px-3 py-4"><span className={"inline-flex whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-bold " + (item.status === "pending" ? "bg-accent/20 text-warning" : item.status === "reviewed" ? "bg-secondary/15 text-foreground" : "bg-muted text-muted-foreground")}>{item.score !== undefined ? item.score + "/10" : label}</span></td><td className="px-4 py-4"><Button variant="ghost" size="sm" aria-label={"Xem " + item.title} className="min-h-9 rounded-xl text-xs text-primary transition-all active:scale-[0.98]" onClick={() => onDetail({title:item.title,label:"Bài tập",description:item.description,facts:[{label:"Môn học",value:course?.subject ?? "—"},{label:"Gia sư",value:course?.tutor ?? "—"},{label:"Hạn nộp",value:item.due},{label:"Trạng thái",value:label},...(item.score !== undefined ? [{label:"Điểm",value:item.score + "/10"}] : [])]})}>Xem</Button></td></tr>;
        })}</tbody>
      </table>
      {assignments.length === 0 && <p className="p-6 text-sm text-muted-foreground">Không tìm thấy bài tập phù hợp.</p>}
    </div>
  </section>;
}