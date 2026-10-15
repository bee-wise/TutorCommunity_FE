"use client";

import { useRef, useState } from "react";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { useGroupAdmission } from "@workspace/core/lms-classes/useGroupAdmission";
import { guid } from "@workspace/core/lms-classes/schemas";
import { AdmissionDetails } from "@workspace/ui/components/lms/AdmissionDetails";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassListPager } from "./ClassListPager";
import { formatClassIdentifier } from "../utils/classes.utils";
import {
  classButton,
  classInput,
  classOutlineButton,
  classPanel,
} from "./classes-ui";

function Admission({ id }: { id: string }) {
  const controller = useGroupAdmission(id);
  return <AdmissionDetails controller={controller} compactTutorView />;
}
const admissionLabels: Record<string, string> = {
  REFERRED: "Đã giới thiệu",
  TRIAL_SCHEDULED: "Đã hẹn học thử",
  TRIAL_COMPLETED: "Đã học thử",
  QUOTED: "Đã báo giá",
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  ENROLLED: "Đã vào lớp",
  LEFT: "Đã rời lớp",
  CANCELLED: "Đã hủy",
};
export function GroupAdmissionsPanel({
  classId,
  active,
}: {
  classId: string;
  active: boolean;
}) {
  const [page, setPage] = useState(1),
    [learner, setLearner] = useState(""),
    [referring, setReferring] = useState(false),
    [selected, setSelected] = useState("");
  const intent = useRef<{ learner: string; id: string } | null>(null);
  const query = useLmsClassResource(
    classId,
    "admissions",
    (s) => service.admissions(classId, page, s),
    { params: [page] },
  );
  const refer = useLmsClassCommand(
    classId,
    (input: Parameters<typeof service.refer>[1]) =>
      service.refer(classId, input),
  );
  async function submit() {
    if (!guid.safeParse(learner).success) return;
    if (intent.current?.learner !== learner)
      intent.current = { learner, id: crypto.randomUUID() };
    try {
      const data = await refer.mutateAsync({
        admissionId: intent.current.id,
        learnerId: learner,
      });
      setSelected(data.id);
      setReferring(false);
      intent.current = null;
      setLearner("");
      toast.success("Đã giới thiệu học viên", {
        description:
          "Học thử, báo giá, thanh toán và duyệt ADD là các bước riêng.",
      });
    } catch {
      toast.error("Chưa giới thiệu được học viên", {
        description:
          "Chỉ gia sư của lớp ACTIVE đã ẩn được giới thiệu học viên.",
      });
    }
  }
  return (
    <section className="space-y-4">
      <h2 className="font-nunito text-lg font-extrabold text-primary">
        Đăng ký & giới thiệu học viên
      </h2>
      {active && <Button className={classButton} onClick={() => setReferring(true)}>Giới thiệu học viên</Button>}
      {query.loading ? (
        <p role="status">Đang tải...</p>
      ) : query.error ? (
        <ClassQueryErrorState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {query.data?.map((a) => (
              <article className={`${classPanel} space-y-2`} key={a.id}>
                <p className="text-sm font-bold">Học viên {formatClassIdentifier(a.learnerId)}</p>
                <p className="text-sm font-bold">{admissionLabels[a.status ?? ""] ?? "Đang xử lý"}</p>
                <Button
                  variant="outline"
                  className={classOutlineButton}
                  onClick={() => setSelected(a.id)}
                >
                  Xem đăng ký
                </Button>
              </article>
            ))}
          </div>
          {!query.data?.length && <p className={`${classPanel} text-sm text-muted-foreground`}>Chưa có học viên đăng ký ở trang này.</p>}
          <ClassListPager page={page} hasNext={(query.data?.length ?? 0) >= 20} label="Phân trang đăng ký" onPageChange={setPage} />
        </>
      )}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(""); }}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-3xl p-4 sm:p-6">
          <DialogTitle className="sr-only">Chi tiết đăng ký tham gia lớp</DialogTitle>
          {selected && <Admission key={selected} id={selected} />}
        </DialogContent>
      </Dialog>
      <Dialog open={referring} onOpenChange={(open) => { if (!refer.isPending) setReferring(open); }}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl">
          <DialogHeader><DialogTitle>Giới thiệu học viên</DialogTitle><DialogDescription>Dán mã học viên đầy đủ để bắt đầu quy trình đăng ký vào lớp.</DialogDescription></DialogHeader>
          <label className="grid gap-1.5 text-sm font-bold">Mã học viên<input value={learner} onChange={(event) => setLearner(event.target.value.trim())} className={classInput} placeholder="Dán mã học viên đầy đủ" /></label>
          <div className="flex justify-end gap-2"><Button variant="outline" className={classOutlineButton} disabled={refer.isPending} onClick={() => setReferring(false)}>Đóng</Button><Button className={classButton} disabled={refer.isPending || !guid.safeParse(learner).success} onClick={() => void submit()}>Giới thiệu vào lớp</Button></div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
