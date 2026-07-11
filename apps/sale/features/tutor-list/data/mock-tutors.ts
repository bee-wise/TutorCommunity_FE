import type { Tutor } from "./types";

// ─── Mock Tutor Data ──────────────────────────────────────────────────────────
// All data is mock. Prices in VND. Avatars from picsum with descriptive seeds.

export const MOCK_TUTORS: Tutor[] = [
  {
    id: "t-001",
    name: "Nguyễn Minh Khoa",
    avatarUrl: "https://picsum.photos/seed/tutor-male-01/200/200",
    headline:
      "Cử nhân Toán – Đại học Sư phạm HN, 5 năm kinh nghiệm dạy luyện thi",
    subjects: ["Toán", "Vật Lý"],
    teachingMode: "both",
    level: "teacher",
    verification: "verified",
    pricing: { perSession: 200000, sessionDurationMin: 60 },
    review: { count: 48, average: 4.9 },
    location: "Quận Cầu Giấy, Hà Nội",
    experience: 5,
    availableNow: true,
    tags: ["Luyện thi THPT", "Toán nâng cao", "Kiên nhẫn"],
  },
  {
    id: "t-002",
    name: "Trần Thị Lan Anh",
    avatarUrl: "https://picsum.photos/seed/tutor-female-02/200/200",
    headline: "Giáo viên Tiếng Anh IELTS 8.0 – Chuyên luyện Speaking & Writing",
    subjects: ["Tiếng Anh"],
    teachingMode: "online",
    level: "teacher",
    verification: "verified",
    pricing: { perSession: 250000, sessionDurationMin: 60 },
    review: { count: 93, average: 5.0 },
    location: "Quận 1, TP.HCM",
    experience: 7,
    availableNow: true,
    tags: ["IELTS", "Speaking", "Cambridge", "Online linh hoạt"],
  },
  {
    id: "t-003",
    name: "Phạm Đức Huy",
    avatarUrl: "https://picsum.photos/seed/tutor-male-03/200/200",
    headline:
      "Sinh viên Bách Khoa, gia sư Tin học lập trình Python & Web cơ bản",
    subjects: ["Tin Học", "Lập Trình"],
    teachingMode: "both",
    level: "student",
    verification: "verified",
    pricing: { perSession: 120000, sessionDurationMin: 90 },
    review: { count: 21, average: 4.7 },
    location: "Quận Bình Thạnh, TP.HCM",
    experience: 2,
    availableNow: false,
    tags: ["Python", "Web cơ bản", "HTML/CSS", "Thân thiện"],
  },
  {
    id: "t-004",
    name: "Lê Hoàng Yến",
    avatarUrl: "https://picsum.photos/seed/tutor-female-04/200/200",
    headline: "Thạc sĩ Hóa học – Dạy Hóa THPT & Đại học, 8 năm kinh nghiệm",
    subjects: ["Hóa Học", "Sinh Học"],
    teachingMode: "offline",
    level: "expert",
    verification: "verified",
    pricing: { perSession: 280000, sessionDurationMin: 60 },
    review: { count: 67, average: 4.8 },
    location: "Quận Đống Đa, Hà Nội",
    experience: 8,
    availableNow: true,
    tags: ["Hóa Đại cương", "Luyện thi ĐH", "Phương pháp hệ thống"],
  },
  {
    id: "t-005",
    name: "Vũ Ngọc Bảo",
    avatarUrl: "https://picsum.photos/seed/tutor-male-05/200/200",
    headline: "Sinh viên Ngoại Thương, gia sư Tiếng Nhật N3 và Ngữ văn",
    subjects: ["Tiếng Nhật", "Ngữ Văn"],
    teachingMode: "online",
    level: "student",
    verification: "pending",
    pricing: { perSession: 100000, sessionDurationMin: 60 },
    review: { count: 9, average: 4.6 },
    location: "Quận Tây Hồ, Hà Nội",
    experience: 1,
    availableNow: true,
    tags: ["JLPT N3", "Tiếng Nhật giao tiếp", "Ngữ văn 12"],
  },
  {
    id: "t-006",
    name: "Đỗ Thị Hương",
    avatarUrl: "https://picsum.photos/seed/tutor-female-06/200/200",
    headline: "Cử nhân Sư phạm Lịch sử – Địa lý, dạy luyện thi THPT Quốc gia",
    subjects: ["Lịch Sử", "Địa Lý"],
    teachingMode: "both",
    level: "teacher",
    verification: "verified",
    pricing: { perSession: 160000, sessionDurationMin: 60 },
    review: { count: 35, average: 4.8 },
    location: "Quận Hoàng Mai, Hà Nội",
    experience: 4,
    availableNow: false,
    tags: ["THPT Quốc gia", "Sử địa cơ bản", "Luyện đề"],
  },
  {
    id: "t-007",
    name: "Ngô Thanh Tùng",
    avatarUrl: "https://picsum.photos/seed/tutor-male-07/200/200",
    headline: "Kỹ sư Phần mềm 10 năm – Dạy lập trình cho người mới bắt đầu",
    subjects: ["Lập Trình", "Tin Học"],
    teachingMode: "online",
    level: "expert",
    verification: "verified",
    pricing: { perSession: 350000, sessionDurationMin: 60 },
    review: { count: 112, average: 4.9 },
    location: "Quận 7, TP.HCM",
    experience: 10,
    availableNow: true,
    tags: ["JavaScript", "React", "Node.js", "Mentor 1-1"],
  },
  {
    id: "t-008",
    name: "Bùi Phương Linh",
    avatarUrl: "https://picsum.photos/seed/tutor-female-08/200/200",
    headline: "Giáo viên Vật lý chuyên ban – Dạy bám sát chương trình mới",
    subjects: ["Vật Lý", "Toán"],
    teachingMode: "offline",
    level: "teacher",
    verification: "verified",
    pricing: { perSession: 190000, sessionDurationMin: 60 },
    review: { count: 44, average: 4.7 },
    location: "Quận 3, TP.HCM",
    experience: 6,
    availableNow: false,
    tags: ["Vật lý 10-12", "SGK mới", "Luyện thi"],
  },
];

// ─── Simulated AI Search Logic ─────────────────────────────────────────────
// Maps keywords in natural-language queries to relevant tutors.
// In production, this would be a real API call.

export function simulateAISearch(query: string): Tutor[] {
  const q = query.toLowerCase();

  // Keyword → subject mapping
  const subjectKeywords: Record<string, string[]> = {
    Toán: ["toán", "math", "đại số", "hình học", "giải tích"],
    "Vật Lý": ["vật lý", "physics", "cơ học", "điện học"],
    "Hóa Học": ["hóa", "chemistry", "hóa hữu cơ", "hóa vô cơ"],
    "Sinh Học": ["sinh", "biology", "sinh lý"],
    "Tiếng Anh": [
      "tiếng anh",
      "english",
      "ielts",
      "toeic",
      "speaking",
      "writing",
    ],
    "Tiếng Nhật": ["tiếng nhật", "japanese", "jlpt", "n3", "n2", "n1"],
    "Ngữ Văn": ["văn", "ngữ văn", "viết", "literature"],
    "Lịch Sử": ["lịch sử", "history", "sử"],
    "Địa Lý": ["địa", "địa lý", "geography"],
    "Tin Học": ["tin học", "máy tính", "computer"],
    "Lập Trình": [
      "lập trình",
      "code",
      "coding",
      "python",
      "javascript",
      "react",
      "web",
      "phần mềm",
    ],
  };

  const modeKeywords: Record<TeachingMode, string[]> = {
    online: ["online", "trực tuyến", "zoom", "meet"],
    offline: ["offline", "tại nhà", "trực tiếp", "gặp mặt"],
    both: [],
  };

  type TeachingMode = "online" | "offline" | "both";

  const matchedSubjects = Object.entries(subjectKeywords)
    .filter(([, keywords]) => keywords.some((kw) => q.includes(kw)))
    .map(([subject]) => subject);

  const matchedMode = Object.entries(modeKeywords).find(([, keywords]) =>
    keywords.some((kw) => q.includes(kw)),
  )?.[0] as TeachingMode | undefined;

  const wantsCheap =
    q.includes("rẻ") || q.includes("tiết kiệm") || q.includes("sinh viên");
  const wantsExpert =
    q.includes("kinh nghiệm") ||
    q.includes("giáo viên") ||
    q.includes("chuyên");
  const wantsOnlineOnly = matchedMode === "online";
  const wantsOfflineOnly = matchedMode === "offline";

  return MOCK_TUTORS.filter((tutor) => {
    // Subject match
    if (matchedSubjects.length > 0) {
      const hasSubject = tutor.subjects.some((s) =>
        matchedSubjects.includes(s),
      );
      if (!hasSubject) return false;
    }

    // Mode match
    if (wantsOnlineOnly && tutor.teachingMode === "offline") return false;
    if (wantsOfflineOnly && tutor.teachingMode === "online") return false;

    // Budget hint
    if (wantsCheap && tutor.pricing.perSession > 150000) return false;

    // Experience hint
    if (wantsExpert && tutor.experience < 4) return false;

    return true;
  }).sort((a, b) => b.review.average - a.review.average);
}

export function simulateManualSearch(
  query: string,
  filters: import("./types").TutorFilters,
): Tutor[] {
  const q = query.toLowerCase().trim();

  return MOCK_TUTORS.filter((tutor) => {
    // Name search
    if (q && !tutor.name.toLowerCase().includes(q)) return false;

    // Subject filter
    if (filters.subjects.length > 0) {
      if (!tutor.subjects.some((s) => filters.subjects.includes(s)))
        return false;
    }

    // Mode filter
    if (
      filters.teachingMode !== "all" &&
      tutor.teachingMode !== filters.teachingMode &&
      tutor.teachingMode !== "both"
    ) {
      return false;
    }

    // Level filter
    if (filters.level !== "all" && tutor.level !== filters.level) return false;

    // Price filter
    if (
      filters.maxPricePerSession !== null &&
      tutor.pricing.perSession > filters.maxPricePerSession
    ) {
      return false;
    }

    // Rating filter
    if (
      filters.minRating !== null &&
      tutor.review.average < filters.minRating
    ) {
      return false;
    }

    // Available only
    if (filters.availableOnly && !tutor.availableNow) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "best_match":
      case "rating":
        return b.review.average - a.review.average;
      case "price_asc":
        return a.pricing.perSession - b.pricing.perSession;
      case "price_desc":
        return b.pricing.perSession - a.pricing.perSession;
      case "experience":
        return b.experience - a.experience;
      default:
        return 0;
    }
  });
}
