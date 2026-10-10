"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { useClassMembers } from "../hooks/useClassMembers";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { ClassMissingState } from "./ClassMissingState";
import { ClassPagination } from "./ClassPagination";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { classInput, classLabel, classOutlineButton, classPage, classPanel, classToolbar } from "./classes-ui";

export function ClassMembersScreen({ classId }: { classId: string }) {
  const list = useClassMembers(classId);
  if (!list.classInfo) return <ClassMissingState />;
  return <div className={classPage}>
    <ClassWorkspaceHeader classInfo={list.classInfo} title="Thành viên lớp" />
    <div className={`${classToolbar} flex flex-wrap items-end gap-3`}>
      <label className="grid min-w-0 max-w-xl flex-[1_1_240px] gap-1"><span className={classLabel}>Tìm học viên</span><input type="search" value={list.search} onChange={(event) => list.updateSearch(event.target.value)} className={classInput} placeholder="Tên, email hoặc trình độ…" /></label>
      <p className="text-xs leading-5 text-muted-foreground sm:pb-3" aria-live="polite">{list.total} học viên phù hợp</p>
    </div>
    {list.members.length ? <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.members.map((learner) => <li key={learner.id} className={`${classPanel} space-y-4`}>
      <ClassLearnerIdentity learner={learner} />
      <p className="text-xs text-muted-foreground">Trình độ: <span className="font-bold text-foreground">{learner.gradeLevel}</span></p>
    </li>)}</ul> : <section className={`${classPanel} space-y-3 py-10 text-center`}><h2 className="text-lg text-primary">Chưa có học viên phù hợp</h2><p className="text-sm text-muted-foreground">Thử tìm bằng tên hoặc email khác.</p>{list.search && <Button variant="outline" className={classOutlineButton} onClick={() => list.updateSearch("")}>Xóa tìm kiếm</Button>}</section>}
    <ClassPagination page={list.page} pageCount={list.pageCount} label="Phân trang thành viên" onPageChange={list.setPage} />
    <p className="text-xs text-muted-foreground">Danh sách và địa chỉ email minh họa; chưa có API quản lý thành viên lớp.</p>
  </div>;
}
