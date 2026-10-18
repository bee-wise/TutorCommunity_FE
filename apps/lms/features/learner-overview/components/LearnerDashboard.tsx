"use client";

import { useState } from "react";
import { BeeWiseLearningArt } from "./BeeWiseLearningArt";
import {
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LearningActivityRail } from "./LearningActivityRail";
import { LearningAssignments } from "./LearningAssignments";
import { LearningCourseGrid } from "./LearningCourseGrid";
import { LearningDetailDialog } from "./LearningDetailDialog";
import type {
  DashboardDetail,
  LearnerDashboardData,
} from "../types/learner-dashboard.types";

export function LearnerDashboard({ data }: { data: LearnerDashboardData }) {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<DashboardDetail | null>(null);

  const term = search.trim().toLocaleLowerCase("vi");
  const courses = data.courses.filter((course) =>
    (course.title + " " + course.tutor).toLocaleLowerCase("vi").includes(term),
  );
  const assignments = data.assignments.filter((item) =>
    (
      item.title +
      " " +
      data.courses.find((course) => course.id === item.courseId)?.subject
    )
      .toLocaleLowerCase("vi")
      .includes(term),
  );

  const next = data.sessions[0];
  const nextCourse = data.courses.find(
    (course) => course.id === next?.courseId,
  );

  const latestFeedbacks = [
    {
      id: "fb-1",
      courseId: "math",
      subject: "Toán",
      tutor: data.feedback.tutor,
      week: "Tuần 2 · Tháng 10/2026",
      date: data.feedback.date,
      content: data.feedback.content,
      tone: "border-primary/25 bg-primary/10 text-primary",
    },
    {
      id: "fb-2",
      courseId: "english",
      subject: "Tiếng Anh",
      tutor: "Cô Phạm Anh Thư",
      week: "Tuần 1 · Tháng 10/2026",
      date: "12/10/2026",
      content:
        "Em đã tìm ý chính tốt hơn trong bài Reading. Hãy tiếp tục luyện thêm câu hỏi True / False / Not Given và chú ý cấu trúc Writing Task 1.",
      tone: "border-accent/40 bg-accent/20 text-warning",
    },
  ];

  return (
    <div className="grid min-h-full items-start xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-7 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                Báo cáo học tập
              </p>
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-2xs">
                Hoàn thành:{" "}
                <strong className="font-bold text-foreground tabular-nums">
                  {data.summary.completed}/{data.summary.total}
                </strong>{" "}
                buổi
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[28px]">
              {data.student.name}
            </h1>
            <span className="mt-2 inline-flex rounded-lg border border-accent/30 bg-accent/15 px-2 py-1 text-[10px] font-bold text-warning">
              Dữ liệu minh họa · 15/10/2026
            </span>
          </div>

          <label className="relative w-full sm:w-52">
            <span className="sr-only">Tìm lớp hoặc bài tập</span>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-3.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm lớp, bài tập…"
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-xs outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>
        </header>

        {/* Top Section: Buổi học kế tiếp & Khung thông báo feedback từ gia sư theo lớp */}
        <section
          aria-label="Tổng quan học tập"
          className="grid gap-5 lg:grid-cols-[1.1fr_1fr]"
        >
          {/* Card Buổi học kế tiếp */}
          <section
            aria-labelledby="next-learning-session"
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-accent/40 bg-accent/10 p-5 shadow-soft sm:p-6"
          >
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_96px] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-accent/40 bg-card px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-warning shadow-2xs">
                  Buổi học kế tiếp
                </span>
                <h2
                  id="next-learning-session"
                  className="mt-3 font-lms text-xl font-extrabold text-foreground sm:text-2xl"
                >
                  {nextCourse?.subject ?? "Chưa có lịch"}
                </h2>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {nextCourse?.tutor}
                </p>

                {next && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {next.topic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {next.date.split("-").reverse().join("/")}
                      <span className="mx-2">·</span>
                      <span className="font-bold text-foreground">
                        {next.start} – {next.end}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <BeeWiseLearningArt
                variant="session"
                className="size-24 shrink-0 sm:size-36"
              />
            </div>

            {next && (
              <div className="pt-5">
                <Button
                  className="min-h-10 rounded-xl px-4 text-xs font-bold shadow-soft transition-all active:scale-[0.98]"
                  onClick={() =>
                    setDetail({
                      title: next.topic,
                      label: "Buổi học kế tiếp",
                      description:
                        "Ôn lại kiến thức buổi trước và chuẩn bị câu hỏi để trao đổi với gia sư. Đây là lịch minh họa.",
                      facts: [
                        { label: "Gia sư", value: nextCourse?.tutor ?? "—" },
                        {
                          label: "Ngày học",
                          value: next.date.split("-").reverse().join("/"),
                        },
                        {
                          label: "Giờ học",
                          value: next.start + " – " + next.end,
                        },
                        { label: "Hình thức", value: next.mode },
                      ],
                    })
                  }
                >
                  Xem buổi học
                </Button>
              </div>
            )}
          </section>

          {/* Khung thông báo về các feedback mới nhất từ gia sư (định kỳ mỗi tuần, 2 feedback mới nhất, không có bộ lọc) */}
          <section
            aria-labelledby="tutor-feedback-heading"
            className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ChatBubbleBottomCenterTextIcon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h2
                      id="tutor-feedback-heading"
                      className="font-lms text-base font-extrabold text-foreground"
                    >
                      Nhận xét từ gia sư
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Đánh giá định kỳ hàng tuần
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  2 tuần gần nhất
                </span>
              </div>

              {/* Feedback items list (2 feedback mới nhất) */}
              <div className="mt-3.5 space-y-3">
                {latestFeedbacks.map((item) => (
                  <article
                    key={item.id}
                    onClick={() =>
                      setDetail({
                        title: `Nhận xét ${item.week} - Môn ${item.subject}`,
                        label: "Chi tiết nhận xét hàng tuần từ gia sư",
                        description: item.content,
                        facts: [
                          { label: "Gia sư", value: item.tutor },
                          { label: "Môn học", value: item.subject },
                          { label: "Kỳ đánh giá", value: item.week },
                          { label: "Ngày gửi", value: item.date },
                        ],
                      })
                    }
                    className="group cursor-pointer rounded-2xl border border-border/70 bg-muted/20 p-3.5 transition-all hover:border-primary/40 hover:bg-muted/40 active:scale-[0.99]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${item.tone}`}
                        >
                          {item.subject}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {item.tutor}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {item.week}
                      </span>
                    </div>
                    <blockquote className="mt-2 text-xs leading-relaxed text-foreground/90 line-clamp-2 transition-all group-hover:line-clamp-none">
                      “{item.content}”
                    </blockquote>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
              <span>Tổng kết định kỳ mỗi tuần</span>
              <span className="font-semibold text-primary">
                Nhấn để xem chi tiết
              </span>
            </div>
          </section>
        </section>

        {term && (
          <p role="status" className="text-xs text-muted-foreground">
            Tìm thấy {courses.length} lớp và {assignments.length} bài tập.
          </p>
        )}

        <LearningCourseGrid courses={courses} onDetail={setDetail} />
        <LearningAssignments
          assignments={assignments}
          courses={data.courses}
          onDetail={setDetail}
        />
      </div>

      <LearningActivityRail data={data} onDetail={setDetail} />
      <LearningDetailDialog detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
}