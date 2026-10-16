"use client";
import { useState } from "react";
import { BeeWiseLearningArt } from "./BeeWiseLearningArt";
import { CalendarDaysIcon, CheckIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { DashboardDetail, LearnerDashboardData } from "../types/learner-dashboard.types";

export function LearningActivityRail({ data, onDetail }: { data: LearnerDashboardData; onDetail: (detail: DashboardDetail) => void }) {
  const [date, setDate] = useState(data.referenceDate);
  const [todos, setTodos] = useState(data.todos);
  const sessions = data.sessions.filter((session) => session.date === date);
  return <aside aria-label="Hồ sơ và lịch học" className="min-w-0 space-y-7 border-t border-border bg-card p-5 sm:p-6 xl:sticky xl:top-0 xl:h-[calc(100dvh-4rem)] xl:overflow-y-auto xl:border-l xl:border-t-0">
    <section aria-label="Học viên minh họa" className="text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-accent/20 text-2xl font-extrabold text-warning ring-4 ring-muted">{data.student.initials}</span>
      <h2 className="mt-4 text-base font-extrabold">{data.student.name}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{data.student.level}</p>
      <dl className="mt-5 space-y-3 rounded-2xl bg-muted/70 p-4 text-left text-xs">
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Bắt đầu học</dt><dd className="font-semibold">{data.student.joined}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Lớp đang học</dt><dd className="font-semibold">{data.courses.length} lớp</dd></div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3"><dt className="text-muted-foreground">Điểm bài tập TB</dt><dd className="text-lg font-extrabold text-primary">{data.summary.average?.toFixed(1) ?? "—"}<span className="text-xs font-medium text-muted-foreground"> /10</span></dd></div>
      </dl>
      <p className="mt-2 text-[10px] text-muted-foreground">Tính trên {data.summary.reviewed} bài đã chấm · minh họa</p>
    </section>

    <section aria-labelledby="week-schedule-heading" className="space-y-4">
      <div className="flex items-center justify-between"><h2 id="week-schedule-heading" className="text-sm font-extrabold">Lịch học trong tuần</h2><CalendarDaysIcon className="size-4 text-muted-foreground" aria-hidden="true" /></div>
      <p className="text-xs font-medium text-muted-foreground">12 – 18 tháng 10, 2026</p>
      <div role="group" aria-label="Chọn ngày xem lịch minh họa" className="grid grid-cols-7 gap-1">{data.week.map((day) => <button key={day.date} type="button" aria-pressed={date === day.date} aria-label={day.day + ", ngày " + day.number + " tháng 10"} onClick={() => setDate(day.date)} className={"flex min-h-16 min-w-0 flex-col items-center justify-center gap-2 rounded-xl text-[10px] font-semibold transition-all duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transform-none " + (date === day.date ? "-translate-y-1 bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted")}><span>{day.day}</span><span className="text-xs font-extrabold tabular-nums">{day.number}</span><span className={"size-1 rounded-full " + (data.sessions.some((session) => session.date === day.date) ? date === day.date ? "bg-primary-foreground" : "bg-primary" : "bg-transparent")} /></button>)}</div>
      <div aria-live="polite" className="space-y-3">
        {sessions.map((session) => {
          const course = data.courses.find((course) => course.id === session.courseId);
          return <button key={session.id} type="button" className="flex w-full items-start gap-3 rounded-2xl border border-border p-3 text-left transition-all duration-300 hover:border-primary/30 hover:bg-muted/50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ring" onClick={() => onDetail({title:session.topic,label:"Buổi học",description:"Buổi học trong lịch minh họa. Thông tin này không tạo lịch hoặc phòng học thực tế.",facts:[{label:"Môn học",value:course?.subject ?? "—"},{label:"Gia sư",value:course?.tutor ?? "—"},{label:"Ngày",value:session.date.split("-").reverse().join("/")},{label:"Thời gian",value:session.start + " – " + session.end},{label:"Hình thức",value:session.mode}]})}><span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><VideoCameraIcon className="size-4" aria-hidden="true" /></span><span className="min-w-0"><span className="block text-xs font-bold">{course?.subject} · {session.start}</span><span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{session.topic}</span><span className="mt-1 block text-[10px] text-muted-foreground">{course?.tutor}</span></span></button>;
        })}
        {sessions.length === 0 && <p className="rounded-2xl border border-dashed border-border p-4 text-xs leading-5 text-muted-foreground">Không có buổi học minh họa trong ngày này.</p>}
      </div>
    </section>

    <section aria-labelledby="learning-todo-heading" className="space-y-3">
      <div className="flex items-center justify-between"><h2 id="learning-todo-heading" className="text-sm font-extrabold">Việc cần làm</h2><span className="text-[10px] font-semibold text-muted-foreground">{todos.filter((item) => item.done).length}/{todos.length}</span></div>
      {todos.map((todo) => <label key={todo.id} className="flex cursor-pointer items-start gap-3 rounded-xl py-1.5 text-xs leading-5"><span className="relative mt-0.5 shrink-0"><input type="checkbox" checked={todo.done} onChange={() => setTodos((items) => items.map((item) => item.id === todo.id ? {...item,done:!item.done} : item))} className="peer sr-only" /><span className="flex size-[18px] items-center justify-center rounded-md border border-border bg-card transition-all peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"><CheckIcon className={"size-3.5 text-primary-foreground " + (todo.done ? "opacity-100" : "opacity-0")} aria-hidden="true" /></span></span><span className={todo.done ? "text-muted-foreground line-through" : "text-foreground"}>{todo.title}</span></label>)}
      <p className="text-[10px] leading-4 text-muted-foreground">Checklist minh họa, chỉ lưu trong lần xem này.</p>
    </section>
    <section aria-labelledby="learning-goal-heading" className="rounded-3xl border border-primary/10 bg-muted/70 p-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1"><h2 id="learning-goal-heading" className="text-xs font-extrabold">Mục tiêu học tập</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">{data.student.goal}</p></div>
        <BeeWiseLearningArt variant="goal" className="size-20" />
      </div>
      <Button variant="outline" className="mt-4 min-h-10 w-full rounded-xl text-xs transition-all active:scale-[0.98]" onClick={() => onDetail({title:"Mục tiêu học tập",label:"Hồ sơ học tập",description:data.student.goal,facts:[{label:"Học viên",value:data.student.name},{label:"Cấp học",value:data.student.level},{label:"Ngày báo cáo",value:"15/10/2026"}]})}>Xem mục tiêu học tập</Button>
    </section>
  </aside>;
}