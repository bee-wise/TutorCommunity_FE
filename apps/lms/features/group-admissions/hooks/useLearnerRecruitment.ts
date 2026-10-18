"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { groupClassesService } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { toast } from "@workspace/ui/components/ui/bee-toast";

const resumeSchema = z.object({ id: z.guid("Nhập mã đăng ký GUID hợp lệ.") });
export function useLearnerRecruitment() {
  const [page, setPage] = useState(1),
    router = useRouter();
  const query = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "learner-recruitment",
    (s) => groupClassesService.recruitment(page, s),
    { roles: ["LEARNER"], params: [page] },
  );
  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: { id: "" },
  });
  const open = form.handleSubmit((v) =>
    router.push(`/lms/learner/group-admissions/${v.id}`),
  );
  return { query, page, setPage, form, open };
}
export function useJoinLearnerGroup(classId: string) {
  const router = useRouter();
  const [id] = useState(() => crypto.randomUUID());
  const command = useLmsClassCommand(
    classId,
    () =>
      groupClassesService.join(classId, {
        admissionId: id,
        acknowledgeMissedLessons: false,
      }),
    ["LEARNER"],
  );
  async function join() {
    if (command.isPending) return;
    try {
      const data = await command.mutateAsync(undefined);
      router.push(`/lms/learner/group-admissions/${data.id}`);
    } catch {
      toast.error("Chưa đăng ký được", {
        description:
          "Kiểm tra trạng thái tuyển sinh. Lớp đã khai giảng/ẩn cần gia sư giới thiệu.",
      });
    }
  }
  return { join, busy: command.isPending };
}
