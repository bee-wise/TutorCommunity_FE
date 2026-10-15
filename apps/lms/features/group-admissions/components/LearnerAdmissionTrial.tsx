"use client";
import { Button } from "@workspace/ui/components/ui/button";
import type { LearnerAdmission } from "../services/learner-admissions.service";
import type { useLearnerAdmission } from "../hooks/useLearnerAdmission";
import { learnerAction } from "../../learner-classes/components/LearnerApiClassCard";

type Controller = ReturnType<typeof useLearnerAdmission>;
const date = (v: string | null | undefined) =>
  v
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(v))
    : "Chưa có lịch";
export function LearnerAdmissionTrial({
  data,
  controller,
  locked,
}: {
  data: LearnerAdmission;
  controller: Controller;
  locked: boolean;
}) {
  const late = Boolean(data.referredByTutorId),
    { busy, run } = controller;
  return (
    <section className="space-y-4">
      {late && (
        <div className="space-y-3">
          <h3 className="font-bold text-primary">Bạn có muốn học thử?</h3>
          <p className="text-sm text-muted-foreground">
            Học thử là tùy chọn với học viên vào muộn. Không thể đổi lựa chọn
            sau khi phát sinh checkout/thanh toán/đối soát.
          </p>
          <div className="flex flex-wrap gap-2">
            {[false, true].map((requested) => (
              <Button
                key={String(requested)}
                className={learnerAction}
                variant={
                  data.trialRequested === requested ? "default" : "outline"
                }
                aria-pressed={data.trialRequested === requested}
                disabled={
                  busy ||
                  locked ||
                  Boolean(data.trialCompletedAt) ||
                  data.trialRequested === requested
                }
                onClick={() => void run({ type: "preference", requested })}
              >
                {requested ? "Tôi muốn học thử" : "Không học thử"}
              </Button>
            ))}
          </div>
        </div>
      )}
      {(!late || data.trialRequested) && (
        <div className="space-y-3">
          <h3 className="font-bold text-primary">Lịch học thử</h3>
          <p className="text-sm">
            {date(data.trialStartAt)} - {date(data.trialEndAt)} (giờ Việt Nam)
          </p>
          <p className="break-words text-sm">
            {data.trialMeetingInfo ?? "Gia sư chưa gửi thông tin phòng học."}
          </p>
          {data.status === "TRIAL_PROPOSED" && (
            <Button
              className={learnerAction}
              disabled={busy}
              onClick={() => void run({ type: "trial/confirm" })}
            >
              Đồng ý lịch học thử
            </Button>
          )}
          {data.trialCompletedAt && (
            <p className="text-sm font-bold">Đã hoàn thành học thử</p>
          )}
        </div>
      )}
    </section>
  );
}
