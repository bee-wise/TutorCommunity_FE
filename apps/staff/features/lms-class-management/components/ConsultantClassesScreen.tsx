"use client";

import { useState, type FormEvent } from "react";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { groupClassesService } from "@workspace/core/lms-classes/group.service";
import { guid } from "@workspace/core/lms-classes/schemas";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { useGroupAdmission } from "@workspace/core/lms-classes/useGroupAdmission";
import { AdmissionDetails } from "@workspace/ui/components/lms/AdmissionDetails";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { GroupReviewPanel } from "./GroupReviewPanel";
import { MemberReviewPanel } from "./MemberReviewPanel";
import {
  billingLabels,
  buttonClass,
  Chip,
  EmptyState,
  fieldClass,
  formatDate,
  ListSkeleton,
  modeLabels,
  money,
  panelClass,
  SectionTitle,
  shortId,
} from "./ClassUi";

const workspaceTabs = [
  { value: "review", label: "Duyệt lớp" },
  { value: "members", label: "Thành viên & yêu cầu" },
  { value: "admissions", label: "Đăng ký & phí tháng đầu" },
] as const;
type WorkspaceTab = (typeof workspaceTabs)[number]["value"];

function Admission({ id }: { id: string }) {
  const controller = useGroupAdmission(id);
  return <AdmissionDetails controller={controller} />;
}
function ClassAdmissions({ classId }: { classId: string }) {
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState("");
  const query = useLmsClassResource(
    classId,
    "admissions",
    (s) => groupClassesService.admissions(classId, page, s),
    { roles: ["CONSULTANT"], params: [page] },
  );
  if (query.loading) return <ListSkeleton rows={2} />;
  if (query.error)
    return (
      <div role="alert" className={panelClass}>
        <p className="flex items-center gap-2 font-bold text-destructive">
          <ExclamationCircleIcon className="size-5" aria-hidden="true" />
          Không xem được đăng ký của lớp
        </p>
        <Button
          variant="outline"
          className={`mt-4 ${buttonClass}`}
          onClick={() => void query.refetch()}
        >
          Tải lại
        </Button>
      </div>
    );
  return (
    <div className="space-y-5">
      <section className={panelClass}>
        <SectionTitle
          aside={<Chip>{query.data?.length ?? 0} đăng ký</Chip>}
        >
          Danh sách đăng ký
        </SectionTitle>
        {query.data?.length ? (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {query.data.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  aria-pressed={selected === a.id}
                  onClick={() => setSelected(a.id)}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] ${selected === a.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">
                      Học viên {shortId(a.learnerId)}
                    </span>
                    <span
                      className={`block text-xs ${selected === a.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                    >
                      {a.trialStartAt
                        ? `Học thử ${formatDate(a.trialStartAt)}`
                        : "Chưa xếp lịch học thử"}
                    </span>
                  </span>
                  <Chip tone={selected === a.id ? "neutral" : "flag"}>
                    {a.status}
                  </Chip>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Chưa có học viên đăng ký lớp này.
          </p>
        )}
        {(page > 1 || (query.data?.length ?? 0) >= 20) && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className={buttonClass}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              className={buttonClass}
              disabled={(query.data?.length ?? 0) < 20}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </section>
      {selected && <Admission key={selected} id={selected} />}
    </div>
  );
}

function ClassWorkspace({
  classId,
  onBack,
}: {
  classId: string;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<WorkspaceTab>("review");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className={buttonClass} onClick={onBack}>
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Danh sách lớp chờ duyệt
        </Button>
      </div>
      <nav
        aria-label="Nội dung lớp học"
        className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border"
      >
        {workspaceTabs.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-current={tab === item.value ? "page" : undefined}
            onClick={() => setTab(item.value)}
            className={`relative min-h-11 shrink-0 px-4 text-sm font-bold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${tab === item.value ? "text-primary after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {tab === "review" && <GroupReviewPanel classId={classId} />}
      {tab === "members" && <MemberReviewPanel classId={classId} />}
      {tab === "admissions" && <ClassAdmissions classId={classId} />}
    </div>
  );
}

export function ConsultantClassesScreen() {
  const [page, setPage] = useState(1),
    [idInput, setIdInput] = useState(""),
    [classId, setClassId] = useState("");
  const pending = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "pending-groups",
    (s) => groupClassesService.pending(page, s),
    { roles: ["CONSULTANT"], params: [page] },
  );
  const validId = guid.safeParse(idInput).success;
  function openById(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validId) setClassId(idInput);
  }
  return (
    <main className="mx-auto max-w-[1200px] space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-nunito text-3xl font-extrabold leading-[1.2]">
          Theo dõi lớp học
        </h1>
        {!classId && (
          <Button
            variant="outline"
            className={buttonClass}
            disabled={pending.loading}
            onClick={() => void pending.refetch()}
          >
            <ArrowPathIcon
              className={`size-4 ${pending.loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Làm mới
          </Button>
        )}
      </header>
      {classId ? (
        <div key={classId}>
          <ClassWorkspace classId={classId} onBack={() => setClassId("")} />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <SectionTitle
              icon={<ClipboardDocumentCheckIcon />}
              aside={
                pending.data?.length ? (
                  <Chip tone="flag">{pending.data.length} lớp chờ duyệt</Chip>
                ) : undefined
              }
            >
              Lớp nhóm chờ duyệt
            </SectionTitle>
            {pending.loading ? (
              <ListSkeleton />
            ) : pending.error ? (
              <div role="alert" className={panelClass}>
                <p className="flex items-center gap-2 font-bold text-destructive">
                  <ExclamationCircleIcon className="size-5" aria-hidden="true" />
                  Chưa tải được hàng chờ
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kiểm tra kết nối hoặc quyền Consultant của tài khoản rồi thử
                  lại.
                </p>
                <Button
                  variant="outline"
                  className={`mt-4 ${buttonClass}`}
                  onClick={() => void pending.refetch()}
                >
                  Tải lại
                </Button>
              </div>
            ) : !pending.data?.length ? (
              <div className={`${panelClass} !p-0`}>
                <EmptyState
                  icon={AcademicCapIcon}
                  title="Không có lớp chờ duyệt"
                >
                  {page > 1
                    ? "Trang này không còn lớp nào."
                    : "Khi gia sư gửi lớp nhóm mới, lớp sẽ hiện ở đây."}
                </EmptyState>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {pending.data.map((g) => (
                  <li
                    key={g.id}
                    className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-hover"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone="flag">Chờ duyệt</Chip>
                      {g.code && <Chip>{g.code}</Chip>}
                    </div>
                    <h3 className="mt-3 font-nunito text-lg font-extrabold leading-snug">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[g.programName, g.teachingItemName, g.contextName]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl bg-muted p-2.5">
                        <dt className="text-muted-foreground">Hình thức</dt>
                        <dd className="mt-0.5 font-bold">
                          {modeLabels[g.teachingMode ?? ""] ?? g.teachingMode ?? "—"}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-muted p-2.5">
                        <dt className="text-muted-foreground">Sĩ số</dt>
                        <dd className="mt-0.5 font-bold tabular-nums">
                          {g.capacity}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-muted p-2.5">
                        <dt className="text-muted-foreground">Số buổi</dt>
                        <dd className="mt-0.5 font-bold tabular-nums">
                          {g.numberOfSessions}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                      <div>
                        <p className="font-nunito text-lg font-black text-primary tabular-nums">
                          {money(g.totalAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {billingLabels[g.billingMode ?? ""] ?? g.billingMode}
                        </p>
                      </div>
                      <Button
                        className={buttonClass}
                        onClick={() => setClassId(g.id)}
                      >
                        Xem & duyệt
                        <ArrowRightIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {(page > 1 || (pending.data?.length ?? 0) >= 20) && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={buttonClass}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  className={buttonClass}
                  disabled={(pending.data?.length ?? 0) < 20}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </section>
          <DisclosureCard
            title="Mở lớp bằng mã lớp"
            description="Dùng khi bạn đã có mã lớp được phân công"
            variant="outline"
            size="lg"
          >
            <form onSubmit={openById} className="flex flex-wrap items-end gap-3">
              <label className="grid min-w-0 flex-1 gap-1.5 text-sm font-medium">
                Mã lớp
                <input
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value.trim())}
                  placeholder="Dán mã lớp vào đây"
                  className={fieldClass}
                  aria-invalid={!!idInput && !validId}
                />
              </label>
              <Button className={buttonClass} disabled={!validId}>
                Mở lớp
              </Button>
            </form>
            {!!idInput && !validId && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                Mã lớp chưa đúng định dạng.
              </p>
            )}
          </DisclosureCard>
        </>
      )}
    </main>
  );
}
