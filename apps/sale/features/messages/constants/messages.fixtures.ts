import type {
  ChatRoom,
  ChatMessage,
  AutoMessageTemplate,
  ChatParticipant,
} from "../types/messages.types";

// ─── Participants ───────────────────────────────────────────
const learner1: ChatParticipant = {
  id: "LRN-001",
  name: "Nguyễn Văn An",
  initials: "NA",
  role: "LEARNER",
  isOnline: true,
};

const learner2: ChatParticipant = {
  id: "LRN-002",
  name: "Trần Thị Bảo",
  initials: "TB",
  role: "LEARNER",
  isOnline: false,
};

const tutor1: ChatParticipant = {
  id: "TUT-001",
  name: "Nguyễn Minh Anh",
  initials: "MA",
  role: "TUTOR",
  isOnline: true,
};

const consultant1: ChatParticipant = {
  id: "CSL-001",
  name: "Linh Trịnh Thị",
  initials: "LT",
  role: "CONSULTANT",
  isOnline: true,
};

const consultant2: ChatParticipant = {
  id: "CSL-002",
  name: "Minh Lê Văn",
  initials: "ML",
  role: "CONSULTANT",
  isOnline: false,
};

// ─── Chat Rooms ─────────────────────────────────────────────
export const mockChatRooms: ChatRoom[] = [
  {
    id: "ROOM-1234",
    connectRequestId: "CONN-1234",
    status: "ACTIVE",
    connectionStage: "DISCUSSING",
    connectionStatus: "ACTIVE",
    learner: learner1,
    tutor: tutor1,
    consultant: consultant1,
    subject: "Toán",
    gradeLevel: "Lớp 10",
    teachingMode: "ONLINE",
    feeProposal: 150000,
    lastMessage: "Em muốn đăng ký học thử vào tuần sau ạ.",
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unreadCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "ROOM-1235",
    connectRequestId: "CONN-1235",
    status: "ACTIVE",
    connectionStage: "TRIAL_SCHEDULED",
    connectionStatus: "ACTIVE",
    learner: learner2,
    tutor: tutor1,
    consultant: consultant2,
    subject: "Tiếng Anh",
    gradeLevel: "IELTS",
    teachingMode: "OFFLINE",
    feeProposal: 200000,
    lastMessage: "Lịch học thử đã được xác nhận vào thứ Tư 18:00.",
    lastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Messages ────────────────────────────────────────────────
export const mockMessages: Record<string, ChatMessage[]> = {
  "ROOM-1234": [
    {
      id: "MSG-001",
      chatRoomId: "ROOM-1234",
      senderId: "SYSTEM",
      senderRole: "CONSULTANT",
      senderName: "Hệ thống",
      type: "SYSTEM",
      text: "Learner Nguyễn Văn An đã gửi yêu cầu kết nối. Phòng chat 3 bên đã được tạo.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-002",
      chatRoomId: "ROOM-1234",
      senderId: "CSL-001",
      senderRole: "CONSULTANT",
      senderName: "Linh Trịnh Thị",
      type: "TEXT",
      text: "Chào Gia Sư Minh Anh và Học Viên An! Mình là Linh - Consultant phụ trách hỗ trợ hai bạn trong quá trình kết nối này. Gia sư có thể chào hỏi và trao đổi với học viên nhé!",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-003",
      chatRoomId: "ROOM-1234",
      senderId: "TUT-001",
      senderRole: "TUTOR",
      senderName: "Nguyễn Minh Anh",
      type: "TEXT",
      text: "Chào An! Mình là Minh Anh, gia sư Toán tại BeeWise. Mình rất vui được hỗ trợ em học Toán lớp 10. Em đang gặp khó khăn ở phần nào vậy?",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-004",
      chatRoomId: "ROOM-1234",
      senderId: "LRN-001",
      senderRole: "LEARNER",
      senderName: "Nguyễn Văn An",
      type: "TEXT",
      text: "Dạ em chào cô ạ! Em đang yếu phần Giải tích và Hình học không gian ạ. Đặc biệt là phần đạo hàm em chưa hiểu rõ.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-005",
      chatRoomId: "ROOM-1234",
      senderId: "SYSTEM",
      senderRole: "CONSULTANT",
      senderName: "Hệ thống",
      type: "SYSTEM",
      text: "Gia sư đã phản hồi. Trạng thái kết nối: Đang thảo luận.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 11 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-006",
      chatRoomId: "ROOM-1234",
      senderId: "TUT-001",
      senderRole: "TUTOR",
      senderName: "Nguyễn Minh Anh",
      type: "TEXT",
      text: "Cô hiểu rồi! Đạo hàm là nền tảng quan trọng. Em muốn học mấy buổi/tuần và khung giờ nào phù hợp với lịch của em?",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-007",
      chatRoomId: "ROOM-1234",
      senderId: "LRN-001",
      senderRole: "LEARNER",
      senderName: "Nguyễn Văn An",
      type: "TEXT",
      text: "Em rảnh tối các ngày trong tuần từ 18h-21h ạ. Em muốn học 2 buổi/tuần. Em muốn đăng ký học thử vào tuần sau ạ.",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "MSG-008",
      chatRoomId: "ROOM-1234",
      senderId: "CSL-001",
      senderRole: "CONSULTANT",
      senderName: "Linh Trịnh Thị",
      type: "WIDGET",
      text: "Mình đề xuất lịch học thử cho hai bạn:",
      widget: {
        widgetType: "TRIAL_SCHEDULE",
        status: "PENDING",
        data: {
          proposedDate: "2026-07-23",
          proposedTime: "18:30",
          durationMinutes: 60,
          teachingMode: "ONLINE",
          note: "Buổi học thử miễn phí 60 phút. Gia sư và học viên xác nhận nhé!",
        },
        createdBy: "CSL-001",
      },
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ],
  "ROOM-1235": [
    {
      id: "MSG-101",
      chatRoomId: "ROOM-1235",
      senderId: "SYSTEM",
      senderRole: "CONSULTANT",
      senderName: "Hệ thống",
      type: "SYSTEM",
      text: "Học viên Trần Thị Bảo đã gửi yêu cầu kết nối với gia sư Nguyễn Minh Anh.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-102",
      chatRoomId: "ROOM-1235",
      senderId: "TUT-001",
      senderRole: "TUTOR",
      senderName: "Nguyễn Minh Anh",
      type: "TEXT",
      text: "Chào Bảo! Mình là Minh Anh, rất vui được hỗ trợ bạn trong hành trình IELTS. Bạn đang nhắm target band nào?",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-103",
      chatRoomId: "ROOM-1235",
      senderId: "LRN-002",
      senderRole: "LEARNER",
      senderName: "Trần Thị Bảo",
      type: "TEXT",
      text: "Chào anh! Em đang target 6.5 overall. Em đặc biệt yếu Writing task 2 và Speaking. Anh có thể giúp em không ạ?",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-104",
      chatRoomId: "ROOM-1235",
      senderId: "CSL-002",
      senderRole: "CONSULTANT",
      senderName: "Minh Lê Văn",
      type: "WIDGET",
      text: "Đã thống nhất lịch học thử:",
      widget: {
        widgetType: "TRIAL_SCHEDULE",
        status: "ACCEPTED",
        data: {
          proposedDate: "2026-07-23",
          proposedTime: "18:00",
          durationMinutes: 90,
          teachingMode: "OFFLINE",
          note: "Gặp mặt tại nhà gia sư, Q.10, TP.HCM.",
        },
        createdBy: "CSL-002",
        respondedBy: "LRN-002",
        respondedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000 - 30 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "MSG-105",
      chatRoomId: "ROOM-1235",
      senderId: "SYSTEM",
      senderRole: "CONSULTANT",
      senderName: "Hệ thống",
      type: "SYSTEM",
      text: "Lịch học thử đã được xác nhận vào thứ Tư 18:00. Trạng thái kết nối: Đã lên lịch học thử.",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ],
};

// ─── Auto Message Templates (Consultant only) ────────────────
export const mockAutoMessageTemplates: AutoMessageTemplate[] = [
  {
    id: "TPL-001",
    category: "GREETING",
    title: "Chào mừng 3 bên",
    content:
      "Chào {learnerName} và {tutorName}! Mình là Consultant phụ trách hỗ trợ hai bạn trong quá trình kết nối. Gia sư hãy chào hỏi học viên nhé!",
  },
  {
    id: "TPL-002",
    category: "GREETING",
    title: "Chào học viên mới",
    content:
      "Xin chào {learnerName}! Cảm ơn bạn đã tin tưởng BeeWise. Gia sư {tutorName} sẽ liên hệ với bạn sớm trong phòng chat này. Nếu cần hỗ trợ, hãy liên hệ mình nhé!",
  },
  {
    id: "TPL-003",
    category: "SCHEDULE",
    title: "Hỏi lịch rảnh",
    content:
      "{learnerName} ơi, bạn có thể chia sẻ khung giờ rảnh trong tuần để mình hỗ trợ sắp xếp lịch học thử với gia sư {tutorName} không?",
  },
  {
    id: "TPL-004",
    category: "SCHEDULE",
    title: "Nhắc xác nhận lịch",
    content:
      "Nhắc nhở cả hai bên xác nhận lịch học thử đã được đề xuất. Nếu cần điều chỉnh, hãy cho mình biết nhé!",
  },
  {
    id: "TPL-005",
    category: "CONFIRM",
    title: "Xác nhận học chính thức",
    content:
      "Chúc mừng {learnerName} và {tutorName}! Sau buổi học thử thành công, mình sẽ tạo hợp đồng học chính thức. Hai bên có đồng ý học tiếp không?",
  },
  {
    id: "TPL-006",
    category: "CLOSE",
    title: "Đóng kết nối lịch sự",
    content:
      "Cảm ơn {learnerName} và {tutorName} đã tham gia. Mình hiểu hai bên chưa phù hợp lần này. {learnerName} hoàn toàn có thể tìm kiếm gia sư khác trên BeeWise. Chúc các bạn thành công!",
  },
  {
    id: "TPL-007",
    category: "GENERAL",
    title: "Nhắc nhở chính sách",
    content:
      "Nhắc nhở: Tất cả thanh toán phải thực hiện qua nền tảng BeeWise. Giao dịch ngoài nền tảng vi phạm điều khoản sử dụng và không được bảo vệ.",
  },
];
