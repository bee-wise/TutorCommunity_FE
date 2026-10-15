"use client";
import { useState } from "react";
import type { AdmissionDto } from "@workspace/core/lms-classes/group.schemas";
import type { GroupAdmissionController } from "@workspace/core/lms-classes/useGroupAdmission";
import { vietnamTimeToUtc } from "@workspace/core/lms-classes/lifecycle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DateTimePicker } from "../ui/date-time-picker";
const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
export function AdmissionTutorActions({
  data,
  busy,
  run,
  portalContainer,
}: {
  data: AdmissionDto;
  busy: boolean;
  run: GroupAdmissionController["run"];
  portalContainer?: HTMLElement | null;
}) {
  const [amount, setAmount] = useState(""),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [meeting, setMeeting] = useState("");
  const [localError, setLocalError] = useState("");
  const action = () =>
    void run({ type: "completeTrial", version: data.version });
  return (
    <>
      {" "}
      <div className="space-y-4">
        {!data.trialCompletedAt && <fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 text-sm font-bold">
            Đề xuất học thử (UTC+7)
          </legend>
          <DateTimePicker id="trial-start-at" label="Bắt đầu" value={start} onChange={setStart} disabled={busy} portalContainer={portalContainer} side="bottom" />
          <DateTimePicker id="trial-end-at" label="Kết thúc" value={end} onChange={setEnd} disabled={busy} portalContainer={portalContainer} side="bottom" />
          <label className="grid gap-1 text-xs sm:col-span-2">
            Phòng học/địa điểm
            <Input
              value={meeting}
              onChange={(e) => setMeeting(e.target.value)}
            />
          </label>
          <Button
            className={button}
            onClick={() => {
              try {
                void run({
                  type: "proposeTrial",
                  input: {
                    expectedVersion: data.version,
                    startAt: vietnamTimeToUtc(start),
                    endAt: vietnamTimeToUtc(end),
                    meetingInfo: meeting || null,
                  },
                });
                setLocalError("");
              } catch {
                setLocalError("Nhập khung giờ học thử hợp lệ.");
              }
            }}
          >
            Đề xuất học thử
          </Button>
        </fieldset>}
        {data.status === "TRIAL_CONFIRMED" && (
          <Button
            variant="outline"
            className={button}
            disabled={busy}
            onClick={() => action()}
          >
            Xác nhận đã học thử
          </Button>
        )}
        {data.referredByTutorId && (
          <label className="grid gap-2 text-sm">
            Báo giá lại tháng hiện tại (VND)
            <Input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              className={button}
              disabled={
                busy || !Number.isInteger(Number(amount)) || Number(amount) <= 0
              }
              onClick={() =>
                void run({
                  type: "proposeFee",
                  input: {
                    expectedVersion: data.version,
                    amount: Number(amount),
                  },
                })
              }
            >
              Gửi báo giá
            </Button>
          </label>
        )}
      </div>{" "}
      {localError && <p role="alert">{localError}</p>}
    </>
  );
}
