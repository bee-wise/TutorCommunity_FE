import type { MeType } from "../types/auth.type";

export type NavbarState =
  | "GUEST"
  | "LEARNER"
  | "TUTOR_ONBOARDING"
  | "TUTOR_APPROVED"
  | "INTERNAL_STAFF";

export type TutorOnboardingStatus =
  | "ACCOUNT_CREATED"
  | "PROFILE_DRAFT"
  | "PROFILE_SUBMITTED"
  | "PAYMENT_PENDING"
  | "INTERVIEW_PENDING"
  | "INTERVIEW_COMPLETED"
  | "PENDING_VERIFICATION"
  | "REJECTED"
  | "APPROVED"
  | "POST_APPROVAL_INFO_REQUIRED"
  | "COMPLETED"
  | "UNVERIFIED"
  | string;

export type NavbarItem = {
  label: string;
  href: string;
  badgeKey?: "unreadChatCount" | "unreadNotificationCount";
};

export type NavbarAction = NavbarItem & {
  variant?: "primary" | "plain";
};

export type NavbarAccountItem = NavbarItem & {
  action?: "logout";
};

export type NavbarConfig = {
  homeHref: string;
  centerItems: NavbarItem[];
  rightItems: NavbarAction[];
  accountItems: NavbarAccountItem[];
  showNotifications: boolean;
};

export type NavbarContext = {
  isAuthenticated: boolean;
  role?: string | null;
  tutorOnboardingStatus?: TutorOnboardingStatus | null;
  lmsAccessEnabled?: boolean | null;
};

const internalStaffRoles = new Set(["ADMIN", "CONSULTANT"]);

export function normalizeRole(role?: string | null) {
  return role?.trim().toUpperCase() ?? "";
}

export function normalizeTutorStatus(status?: string | null) {
  return status?.trim().toUpperCase() ?? "";
}

export function getTutorOnboardingStatus(user?: MeType | null) {
  return (
    user?.tutorOnboardingStatus ??
    user?.tutorProfileStatus ??
    user?.onboardingStatus ??
    user?.status ??
    null
  );
}

export function resolveNavbarState({
  isAuthenticated,
  role,
  lmsAccessEnabled,
}: NavbarContext): NavbarState {
  if (!isAuthenticated) return "GUEST";

  const normalizedRole = normalizeRole(role);

  if (internalStaffRoles.has(normalizedRole)) return "INTERNAL_STAFF";
  if (normalizedRole === "LEARNER") return "LEARNER";

  if (normalizedRole === "TUTOR") {
    if (lmsAccessEnabled === true) return "TUTOR_APPROVED";
    return "TUTOR_ONBOARDING";
  }

  return "GUEST";
}

const guestMenu: NavbarItem[] = [
  { label: "Gia sư", href: "/tutors" },
  { label: "Cách hoạt động", href: "/#how-it-works" },
  { label: "Trở thành gia sư", href: "/tutor-guide" },
];

const learnerMenu: NavbarItem[] = [
  { label: "Tìm gia sư", href: "/tutors" },
  { label: "Tin nhắn", href: "/messages", badgeKey: "unreadChatCount" },
  { label: "Lịch sử kết nối", href: "/connections" },
  { label: "Gia sư yêu thích", href: "/favorite-tutors" },
];

const tutorOnboardingMenu: NavbarItem[] = [
  { label: "Quy trình đăng ký", href: "/tutor-guide" },
  { label: "Hồ sơ gia sư", href: "/tutor/profile" },
  { label: "Trạng thái hồ sơ", href: "/tutor/application-status" },
];

const tutorApprovedMenu: NavbarItem[] = [
  { label: "Hồ sơ của tôi", href: "/tutor/profile" },
  { label: "Kết nối / Tin nhắn", href: "/messages", badgeKey: "unreadChatCount" },
  { label: "Lịch rảnh", href: "/tutor/availability" },
  { label: "Thông tin thanh toán", href: "/tutor/payments" },
];

const tutorPostApprovalMenu: NavbarItem[] = [
  { label: "Hồ sơ của tôi", href: "/tutor/profile" },
  { label: "Bổ sung thông tin", href: "/tutor/post-approval" },
  { label: "Lịch rảnh", href: "/tutor/availability" },
  { label: "Thông tin thanh toán", href: "/tutor/payments" },
];

const internalStaffMenu: NavbarItem[] = [
  { label: "Operations Portal", href: "/staff" },
];

const guestConfig: NavbarConfig = {
  homeHref: "/",
  centerItems: guestMenu,
  rightItems: [
    { label: "Đăng nhập", href: "/login", variant: "plain" },
    { label: "Tìm gia sư", href: "/tutors", variant: "primary" },
  ],
  accountItems: [],
  showNotifications: false,
};

export function getNavbarConfig({
  state,
  tutorOnboardingStatus,
  lmsAccessEnabled,
}: {
  state: NavbarState;
  tutorOnboardingStatus?: TutorOnboardingStatus | null;
  lmsAccessEnabled?: boolean | null;
}): NavbarConfig {
  if (state === "LEARNER") {
    return {
      homeHref: "/tutors",
      centerItems: learnerMenu,
      rightItems: lmsAccessEnabled
        ? [{ label: "Vào LMS", href: "/lms/learner", variant: "primary" }]
        : [],
      accountItems: [
        { label: "Hồ sơ của tôi", href: "/profile" },
        { label: "Cài đặt tài khoản", href: "/account/settings" },
        { label: "Đăng xuất", href: "/", action: "logout" },
      ],
      showNotifications: true,
    };
  }

  if (state === "TUTOR_ONBOARDING") {
    const status = normalizeTutorStatus(tutorOnboardingStatus);
    const statusMenu: NavbarItem[] = [];

    if (status === "PAYMENT_PENDING") {
      statusMenu.push({ label: "Thanh toán", href: "/tutor/payment" });
    }

    if (status === "INTERVIEW_PENDING" || status === "INTERVIEW_COMPLETED") {
      statusMenu.push({ label: "Phỏng vấn", href: "/tutor/interview" });
    }

    if (status === "PROFILE_DRAFT" || status === "POST_APPROVAL_INFO_REQUIRED") {
      statusMenu.push({ label: "Bổ sung hồ sơ", href: "/tutor/profile" });
    }

    if (status === "REJECTED") {
      statusMenu.push({ label: "Xem lý do từ chối", href: "/tutor/rejection" });
    }

    return {
      homeHref: "/tutor/application-status",
      centerItems: [...tutorOnboardingMenu, ...statusMenu],
      rightItems: [],
      accountItems: [
        { label: "Tài khoản", href: "/account" },
        { label: "Hỗ trợ", href: "/support" },
        { label: "Đăng xuất", href: "/", action: "logout" },
      ],
      showNotifications: true,
    };
  }

  if (state === "TUTOR_APPROVED") {
    const isCompleted = normalizeTutorStatus(tutorOnboardingStatus) === "COMPLETED";

    return {
      homeHref: "/tutor/profile",
      centerItems: isCompleted ? tutorApprovedMenu : tutorPostApprovalMenu,
      rightItems: lmsAccessEnabled
        ? [{ label: "Vào LMS", href: "/lms/tutor/dashboard", variant: "primary" }]
        : [],
      accountItems: [
        { label: "Tài khoản", href: "/account" },
        { label: "Hỗ trợ", href: "/support" },
        { label: "Đăng xuất", href: "/", action: "logout" },
      ],
      showNotifications: true,
    };
  }

  if (state === "INTERNAL_STAFF") {
    return {
      homeHref: "/staff",
      centerItems: internalStaffMenu,
      rightItems: [{ label: "Vào portal", href: "/staff", variant: "primary" }],
      accountItems: [
        { label: "Tài khoản", href: "/account" },
        { label: "Đăng xuất", href: "/", action: "logout" },
      ],
      showNotifications: true,
    };
  }

  return guestConfig;
}
