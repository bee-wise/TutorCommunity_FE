import { BeeWiseLearningArt } from "./BeeWiseLearningArt";
import { AcademicCapIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { DashboardDetail, LearningCourse } from "../types/learner-dashboard.types";

const tones = { primary: "bg-primary/10 text-primary", accent: "bg-accent/20 text-warning", secondary: "bg-secondary/15 text-foreground" };

export function LearningCourseGrid({ courses, onDetail }: { courses: LearningCourse[]; onDetail: (detail: DashboardDetail) => void }) {
  return <section aria-labelledby="learning-courses-heading" className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="learning-courses-heading" className="text-lg font-extrabold">Lớp đang theo học</h2><span className="text-xs font-medium text-muted-foreground">{courses.length} lớp</span></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{courses.map((course) => {
      const percentage = Math.round(course.completed / course.total * 100);
      return <article key={course.id} className="flex min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-soft-hover">
        <div className="flex items-center justify-between"><span className={"flex size-10 items-center justify-center rounded-xl " + tones[course.tone]}><AcademicCapIcon className="size-5" aria-hidden="true" /></span><span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-bold text-foreground">Đang học</span></div>
        <h3 className="mt-4 text-sm font-extrabold leading-6">{course.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.tutor}</p>
        <p className="mt-4 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground"><ClockIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{course.schedule}</p>
        <div className="mt-4 flex items-center justify-between text-xs"><span className="text-muted-foreground">{course.completed}/{course.total} buổi</span><span className="font-bold text-primary">{percentage}%</span></div>
        <div role="progressbar" aria-label={"Tiến độ " + course.subject} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width: percentage + "%"}} /></div>
        <Button variant="outline" className="mt-5 min-h-10 w-full rounded-xl text-xs transition-all duration-300 active:scale-[0.98]" onClick={() => onDetail({title:course.title,label:"Tiến độ lớp học",description:"Thông tin lớp và tiến độ của học viên trong bộ dữ liệu báo cáo minh họa.",facts:[{label:"Gia sư",value:course.tutor},{label:"Lịch học",value:course.schedule},{label:"Đã hoàn thành",value:course.completed + "/" + course.total + " buổi"}]})}>Xem tiến độ</Button>
      </article>;
    })}</div>
    {courses.length === 0 && <div className="flex items-center gap-4 rounded-3xl border border-dashed border-border bg-card p-5 sm:p-6"><BeeWiseLearningArt variant="empty" className="size-16 sm:size-20" /><div className="min-w-0"><p className="text-sm font-bold">Không tìm thấy lớp phù hợp.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Thử tên môn học hoặc tên gia sư khác.</p></div></div>}
  </section>;
}