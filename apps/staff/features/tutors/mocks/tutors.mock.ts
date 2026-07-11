export type TutorStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MockTutorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  education: {
    university: string;
    degree: string;
    major: string;
    graduationYear: number;
    documents: string[]; // Mock URLs
  };
  teachingPreferences: {
    subjects: string[];
    grades: string[];
    expectedRate: number; // VND per hour
    availableHours: number; // per week
  };
  interviewResults: {
    interviewer: string;
    interviewDate: string;
    score: number; // out of 10
    notes: string;
    recordingUrl: string;
  };
  status: TutorStatus;
  submittedAt: string;
  updatedAt: string;
  rejectReason?: string;
}

export const mockTutors: MockTutorProfile[] = [
  {
    id: "TUTOR_001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    avatar: "https://picsum.photos/seed/TUTOR_001/200",
    bio: "Sinh viên năm 3 Đại học Bách Khoa, có 2 năm kinh nghiệm gia sư Toán Lý Hóa cấp 3.",
    education: {
      university: "Đại học Bách Khoa Hà Nội",
      degree: "Cử nhân",
      major: "Khoa học Máy tính",
      graduationYear: 2025,
      documents: ["bang_diem_hk1_2023.pdf", "cccd_mat_truoc.jpg"],
    },
    teachingPreferences: {
      subjects: ["Toán", "Lý", "Hóa"],
      grades: ["Lớp 10", "Lớp 11", "Lớp 12", "Ôn thi Đại học"],
      expectedRate: 150000,
      availableHours: 10,
    },
    interviewResults: {
      interviewer: "Tran Thi B (Consultant)",
      interviewDate: "2026-07-05T10:00:00Z",
      score: 8.5,
      notes: "Kỹ năng sư phạm tốt, truyền đạt rõ ràng. Nắm vững kiến thức THPT.",
      recordingUrl: "https://example.com/recording_001",
    },
    status: "PENDING",
    submittedAt: "2026-07-06T08:30:00Z",
    updatedAt: "2026-07-06T08:30:00Z",
  },
  {
    id: "TUTOR_002",
    name: "Trần Thị Bích",
    email: "bichtran@gmail.com",
    phone: "0912345678",
    avatar: "https://picsum.photos/seed/TUTOR_002/200",
    bio: "Giáo viên tiếng Anh IELTS 7.5, kinh nghiệm luyện thi vào 10 chuyên.",
    education: {
      university: "Đại học Ngoại Ngữ - ĐHQGHN",
      degree: "Cử nhân",
      major: "Sư phạm Tiếng Anh",
      graduationYear: 2020,
      documents: ["bang_tot_nghiep.pdf", "chung_chi_ielts.pdf"],
    },
    teachingPreferences: {
      subjects: ["Tiếng Anh"],
      grades: ["Lớp 9", "Lớp 10", "IELTS"],
      expectedRate: 250000,
      availableHours: 15,
    },
    interviewResults: {
      interviewer: "Le Van C (Consultant)",
      interviewDate: "2026-07-01T14:00:00Z",
      score: 9.0,
      notes: "Phát âm chuẩn, có phương pháp giảng dạy hiện đại, cực kỳ tự tin.",
      recordingUrl: "https://example.com/recording_002",
    },
    status: "APPROVED",
    submittedAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-02T09:00:00Z",
  },
  {
    id: "TUTOR_003",
    name: "Lê Minh Trí",
    email: "minhtri.le@gmail.com",
    phone: "0987654321",
    avatar: "https://picsum.photos/seed/TUTOR_003/200",
    bio: "Sinh viên năm nhất Ngoại thương.",
    education: {
      university: "Đại học Ngoại Thương",
      degree: "Đang học",
      major: "Kinh tế đối ngoại",
      graduationYear: 2028,
      documents: ["the_sinh_vien.jpg"],
    },
    teachingPreferences: {
      subjects: ["Vật Lý", "Hóa Học"],
      grades: ["Lớp 8", "Lớp 9"],
      expectedRate: 100000,
      availableHours: 5,
    },
    interviewResults: {
      interviewer: "Tran Thi B (Consultant)",
      interviewDate: "2026-07-10T09:00:00Z",
      score: 5.0,
      notes: "Thiếu kinh nghiệm sư phạm, chưa có giáo án rõ ràng.",
      recordingUrl: "https://example.com/recording_003",
    },
    status: "REJECTED",
    submittedAt: "2026-07-09T15:00:00Z",
    updatedAt: "2026-07-10T11:00:00Z",
    rejectReason: "Cần cải thiện thêm kỹ năng sư phạm và chuẩn bị giáo án bài bản hơn trước khi nhận lớp.",
  },
  {
    id: "TUTOR_004",
    name: "Phạm Hoàng Sơn",
    email: "sonpham.edu@gmail.com",
    phone: "0934567890",
    avatar: "https://picsum.photos/seed/TUTOR_004/200",
    bio: "Chuyên gia sư Ngữ Văn cho học sinh mất gốc.",
    education: {
      university: "Đại học Sư phạm TP.HCM",
      degree: "Cử nhân",
      major: "Sư phạm Ngữ Văn",
      graduationYear: 2022,
      documents: ["bang_tot_nghiep_sphcm.pdf"],
    },
    teachingPreferences: {
      subjects: ["Ngữ Văn"],
      grades: ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
      expectedRate: 180000,
      availableHours: 12,
    },
    interviewResults: {
      interviewer: "Nguyen Quoc D (Consultant)",
      interviewDate: "2026-07-11T08:30:00Z",
      score: 8.0,
      notes: "Chuyên môn vững, giọng đọc truyền cảm. Đã có kinh nghiệm xử lý học sinh yếu kém.",
      recordingUrl: "https://example.com/recording_004",
    },
    status: "PENDING",
    submittedAt: "2026-07-11T09:00:00Z",
    updatedAt: "2026-07-11T09:00:00Z",
  },
];
