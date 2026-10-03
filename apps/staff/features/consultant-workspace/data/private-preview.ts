import type { WorkspaceMessage, WorkspaceRoom } from "../types/workspace";

export const privatePreviewRooms: WorkspaceRoom[] = [
  {
    id: "preview-learner",
    kind: "private",
    isMock: true,
    status: "ACTIVE",
    participants: [
      { id: "preview-consultant", name: "Tư vấn viên", role: "CONSULTANT" },
      { id: "preview-learner-user", name: "Nguyễn Minh Anh", role: "LEARNER" },
    ],
    createdAt: "2026-10-03T08:30:00+07:00",
    updatedAt: "2026-10-03T09:12:00+07:00",
  },
  {
    id: "preview-tutor",
    kind: "private",
    isMock: true,
    status: "ACTIVE",
    participants: [
      { id: "preview-consultant", name: "Tư vấn viên", role: "CONSULTANT" },
      { id: "preview-tutor-user", name: "Trần Quốc Bảo", role: "TUTOR" },
    ],
    createdAt: "2026-10-03T07:55:00+07:00",
    updatedAt: "2026-10-03T08:40:00+07:00",
  },
];

export const privatePreviewMessages: Record<string, WorkspaceMessage[]> = {
  "preview-learner": [
    { id: "l1", senderId: "preview-learner-user", content: "Em muốn hỏi thêm về lịch học thử với gia sư ạ.", createdAt: "2026-10-03T09:10:00+07:00" },
    { id: "l2", senderId: "preview-consultant", content: "Mình sẽ kiểm tra lịch phù hợp và cập nhật cho em ngay nhé.", createdAt: "2026-10-03T09:12:00+07:00" },
  ],
  "preview-tutor": [
    { id: "t1", senderId: "preview-tutor-user", content: "Mình có thể đổi khung giờ học thử sang tối thứ Sáu không?", createdAt: "2026-10-03T08:38:00+07:00" },
    { id: "t2", senderId: "preview-consultant", content: "Mình đã ghi nhận và sẽ trao đổi với học viên trước khi xác nhận.", createdAt: "2026-10-03T08:40:00+07:00" },
  ],
};
