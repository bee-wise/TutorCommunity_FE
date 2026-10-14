"use client";

import { useState } from "react";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { useGroupAdmission } from "@workspace/core/lms-classes/useGroupAdmission";
import { AdmissionDetails } from "@workspace/ui/components/lms/AdmissionDetails";
import { Button } from "@workspace/ui/components/ui/button";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import Link from "next/link";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
export function LearnerAdmissionScreen({
  admissionId,
}: {
  admissionId: string;
}) {
  const controller = useGroupAdmission(admissionId);
  return (
    <main className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Đăng ký lớp nhóm
      </h1>
      <Button asChild variant="outline" className={button}>
        <Link href="/lms/learner/group-classes">Danh sách tuyển sinh</Link>
      </Button>
      <AdmissionDetails controller={controller} />
    </main>
  );
}
function RecruitingCard({
  id,
  title,
  code,
}: {
  id: string;
  title: string | null | undefined;
  code: string | null | undefined;
}) {
  const [admissionId] = useState(() => crypto.randomUUID());
  const [created, setCreated] = useState<string | null>(null);
  const join = useLmsClassCommand(
    id,
    () => service.join(id, { admissionId, acknowledgeMissedLessons: false }),
    ["LEARNER"],
  );
  async function request() {
    try {
      const data = await join.mutateAsync(undefined);
      setCreated(data.id);
      toast.success("Đã đăng ký", {
        description: "Chưa cấp quyền LMS. Tiếp tục học thử và các bước duyệt.",
      });
    } catch {
      toast.error("Chưa đăng ký được", {
        description:
          "Lớp đã ẩn/ACTIVE cần Tutor giới thiệu. Không tự đăng ký lớp đã ẩn.",
      });
    }
  }
  return (
    <article className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-nunito text-lg font-extrabold text-primary">
        {title ?? "Lớp nhóm"}
      </h2>
      <p className="text-xs text-muted-foreground">{code}</p>
      {created ? (
        <Button asChild className={button}>
          <Link href={`/lms/learner/group-admissions/${created}`}>
            Tiếp tục đăng ký
          </Link>
        </Button>
      ) : (
        <Button
          className={button}
          disabled={join.isPending}
          onClick={() => void request()}
        >
          Đăng ký học thử
        </Button>
      )}
    </article>
  );
}
export function LearnerGroupAdmissionsScreen() {
  const [page, setPage] = useState(1);
  const query = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "recruitment",
    (s) => service.recruitment(page, s),
    { roles: ["LEARNER"], params: [page] },
  );
  return (
    <main className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Lớp nhóm tuyển sinh
      </h1>
      {query.loading ? (
        <p role="status">Đang tải...</p>
      ) : query.error ? (
        <div role="alert">
          <p>Không tải được danh sách hoặc không có quyền.</p>
          <Button
            variant="outline"
            className={button}
            onClick={() => void query.refetch()}
          >
            Tải lại
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data?.map((g) => (
              <RecruitingCard
                key={g.id}
                id={g.id}
                title={g.title}
                code={g.code}
              />
            ))}
          </div>
          {!query.data?.length && (
            <p>Chưa có lớp đang tuyển sinh ở trang này.</p>
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
              disabled={(query.data?.length ?? 0) < 20}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
