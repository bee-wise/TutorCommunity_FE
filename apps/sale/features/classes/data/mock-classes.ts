export type ClassSubject = "Toán" | "Tiếng Anh" | "Vật lý" | "Hóa học" | "Ngữ văn";
export type ClassFormat = "Online" | "Trực tiếp";
export type ClassTime = "Buổi tối" | "Cuối tuần" | "Buổi chiều";

export type MockClass = {
  id: string;
  subject: ClassSubject;
  level: string;
  title: string;
  description: string;
  tutor: string;
  tutorImage: string;
  format: ClassFormat;
  location: string;
  schedule: string;
  time: ClassTime;
  startDate: string;
  duration: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSession: number;
  highlight?: string;
};

export const MOCK_CLASSES: MockClass[] = [
  {
    id: "toan-12-on-thi",
    subject: "Toán",
    level: "Lớp 12",
    title: "Toán 12: Ôn thi tốt nghiệp vững từng chuyên đề",
    description: "Hệ thống kiến thức, luyện đề và chữa bài theo nhóm nhỏ.",
    tutor: "Nguyễn Thảo Vy",
    tutorImage: "/images/Tutor/1.png",
    format: "Online",
    location: "Google Meet",
    schedule: "Thứ 3, 5 · 19:30",
    time: "Buổi tối",
    startDate: "05/10/2026",
    duration: "12 buổi · 90 phút/buổi",
    availableSeats: 3,
    totalSeats: 8,
    pricePerSession: 180000,
    highlight: "Sắp khai giảng",
  },
  {
    id: "ielts-speaking",
    subject: "Tiếng Anh",
    level: "IELTS 5.5–6.5",
    title: "IELTS Speaking: Nói tự nhiên, phản xạ tự tin",
    description: "Thực hành theo chủ đề và nhận góp ý sau mỗi buổi học.",
    tutor: "Nguyễn Thảo Vy",
    tutorImage: "/images/Tutor/1.png",
    format: "Online",
    location: "Google Meet",
    schedule: "Thứ 7, CN · 09:00",
    time: "Cuối tuần",
    startDate: "10/10/2026",
    duration: "10 buổi · 90 phút/buổi",
    availableSeats: 2,
    totalSeats: 6,
    pricePerSession: 220000,
    highlight: "Còn 2 chỗ",
  },
  {
    id: "ly-11-nen-tang",
    subject: "Vật lý",
    level: "Lớp 11",
    title: "Vật lý 11: Hiểu bản chất, giải bài tập chắc tay",
    description: "Cùng giải thích hiện tượng và luyện các dạng bài trọng tâm.",
    tutor: "Trần Minh Quân",
    tutorImage: "/images/Tutor/2.png",
    format: "Trực tiếp",
    location: "Quận 3, TP.HCM",
    schedule: "Thứ 2, 4 · 18:00",
    time: "Buổi tối",
    startDate: "12/10/2026",
    duration: "12 buổi · 90 phút/buổi",
    availableSeats: 4,
    totalSeats: 8,
    pricePerSession: 200000,
  },
  {
    id: "hoa-10-mat-goc",
    subject: "Hóa học",
    level: "Lớp 10",
    title: "Hóa 10 từ đầu: Nắm chắc kiến thức nền",
    description: "Học chậm, hỏi kỹ, làm bài ngay sau mỗi chủ đề.",
    tutor: "Lê Hoàng Nam",
    tutorImage: "/images/Tutor/6.png",
    format: "Online",
    location: "Google Meet",
    schedule: "Thứ 4, 6 · 19:00",
    time: "Buổi tối",
    startDate: "14/10/2026",
    duration: "8 buổi · 90 phút/buổi",
    availableSeats: 5,
    totalSeats: 8,
    pricePerSession: 160000,
  },
  {
    id: "van-9-vao-10",
    subject: "Ngữ văn",
    level: "Lớp 9",
    title: "Ngữ văn 9: Viết đúng ý, tự tin vào lớp 10",
    description: "Đọc hiểu, lập dàn ý và luyện viết với góp ý cá nhân.",
    tutor: "Nguyễn Thảo Vy",
    tutorImage: "/images/Tutor/1.png",
    format: "Trực tiếp",
    location: "Bình Thạnh, TP.HCM",
    schedule: "Chủ nhật · 14:00",
    time: "Cuối tuần",
    startDate: "18/10/2026",
    duration: "10 buổi · 120 phút/buổi",
    availableSeats: 0,
    totalSeats: 6,
    pricePerSession: 190000,
  },
  {
    id: "toan-8-chieu",
    subject: "Toán",
    level: "Lớp 8",
    title: "Toán 8: Xây nền đại số và hình học",
    description: "Luyện tư duy giải bài theo từng bước, dễ theo kịp ở trường.",
    tutor: "Trần Minh Quân",
    tutorImage: "/images/Tutor/2.png",
    format: "Online",
    location: "Google Meet",
    schedule: "Thứ 3, 5 · 16:30",
    time: "Buổi chiều",
    startDate: "20/10/2026",
    duration: "12 buổi · 90 phút/buổi",
    availableSeats: 4,
    totalSeats: 8,
    pricePerSession: 150000,
  },
];
