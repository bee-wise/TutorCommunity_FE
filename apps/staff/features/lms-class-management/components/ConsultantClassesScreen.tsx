"use client";

import { useState } from "react";
import { groupClassesService } from "@workspace/core/lms-classes/group.service";
import { guid } from "@workspace/core/lms-classes/schemas";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { useGroupAdmission } from "@workspace/core/lms-classes/useGroupAdmission";
import { AdmissionDetails } from "@workspace/ui/components/lms/AdmissionDetails";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { GroupReviewPanel } from "./GroupReviewPanel";
import { MemberReviewPanel } from "./MemberReviewPanel";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
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
  return (
    <section className="space-y-4">
      <h2 className="font-nunito text-xl font-extrabold text-primary">
        Đăng ký & phí tháng đầu
      </h2>
      {query.loading ? (
        <p role="status">Đang tải...</p>
      ) : query.error ? (
        <p role="alert">Không xem được đăng ký của lớp.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {query.data?.map((a) => (
              <Button
                key={a.id}
                variant="outline"
                className={button}
                onClick={() => setSelected(a.id)}
              >
                {a.status} - {a.learnerId.slice(0, 8)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={button}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              className={button}
              disabled={(query.data?.length ?? 0) < 20}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </>
      )}
      {selected && <Admission key={selected} id={selected} />}
    </section>
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
  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Theo dõi lớp học
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (guid.safeParse(idInput).success) setClassId(idInput);
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="grid min-w-0 flex-1 gap-1 text-xs font-bold">
          Mã lớp (GUID)
          <Input
            value={idInput}
            onChange={(e) => setIdInput(e.target.value.trim())}
          />
        </label>
        <Button className={button} disabled={!guid.safeParse(idInput).success}>
          Mở lớp được phân công
        </Button>
      </form>
      <section className="space-y-3">
        <h2 className="font-nunito text-lg font-extrabold text-primary">
          Lớp nhóm chờ duyệt
        </h2>
        {pending.loading ? (
          <p role="status">Đang tải...</p>
        ) : pending.error ? (
          <div role="alert">
            <p>Chưa tải được hàng chờ hoặc không có quyền.</p>
            <Button
              variant="outline"
              className={button}
              onClick={() => void pending.refetch()}
            >
              Tải lại
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {pending.data?.map((g) => (
                <article
                  className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft"
                  key={g.id}
                >
                  <h3 className="font-bold">{g.title}</h3>
                  <p className="text-xs">{g.code}</p>
                  <Button
                    variant="outline"
                    className={button}
                    onClick={() => setClassId(g.id)}
                  >
                    Xem & duyệt
                  </Button>
                </article>
              ))}
            </div>
            {!pending.data?.length && (
              <p>Không có lớp chờ duyệt ở trang này.</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={button}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                className={button}
                disabled={(pending.data?.length ?? 0) < 20}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          </>
        )}
      </section>
      {classId && (
        <div key={classId} className="space-y-6">
          <GroupReviewPanel classId={classId} />
          <MemberReviewPanel classId={classId} />
          <ClassAdmissions classId={classId} />
        </div>
      )}
    </main>
  );
}
