import {
  Calendar,
  CalendarDays,
  FolderOpen,
  MessageCircle,
  CreditCard,
  History,
  LayoutDashboard,
  MessageSquare,
  FolderCog,
  Wallet,
  UserCircle,
  PieChart,
  UserCheck,
  Users,
  MonitorPlay,
  Receipt,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export type RoleNavigation = Record<"LEARNER" | "TUTOR" | "CONSULTANT" | "ADMIN", NavGroup[]>;

export const navigationConfig: RoleNavigation = {
  LEARNER: [
    {
      groupName: "Học Tập",
      items: [
        {
          title: "Quản Lý Lịch Học",
          url: "/lms/learner/schedule",
          icon: Calendar,
        },
        {
          title: "Kho Tài Liệu",
          url: "/lms/learner/materials",
          icon: FolderOpen,
        },
        {
          title: "Phòng Chat Hiện Tại",
          url: "/lms/learner/chat",
          icon: MessageCircle,
        },
      ],
    },
    {
      groupName: "Tài Khoản",
      items: [
        {
          title: "Học Phí & Thanh Toán",
          url: "/lms/learner/billing",
          icon: CreditCard,
        },
        {
          title: "Lịch Sử Kết Nối",
          url: "/lms/learner/history",
          icon: History,
        },
      ],
    },
  ],
  TUTOR: [
    {
      groupName: "Tổng Quan",
      items: [
        {
          title: "Dashboard",
          url: "/lms/tutor",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupName: "Công Việc",
      items: [
        {
          title: "Lịch Dạy",
          url: "/lms/tutor/schedule",
          icon: CalendarDays,
        },
        {
          title: "Quản Lý Tin Nhắn",
          url: "/lms/tutor/messages",
          icon: MessageSquare,
        },
        {
          title: "Quản Lý Tài Liệu",
          url: "/lms/tutor/materials",
          icon: FolderCog,
        },
      ],
    },
    {
      groupName: "Quản Trị Cá Nhân",
      items: [
        {
          title: "Thu Nhập & Thanh Toán",
          url: "/lms/tutor/earnings",
          icon: Wallet,
        },
        {
          title: "Lịch Sử Kết Nối",
          url: "/lms/tutor/history",
          icon: History,
        },
        {
          title: "Hồ Sơ Của Tôi",
          url: "/lms/tutor/profile",
          icon: UserCircle,
        },
      ],
    },
  ],
  CONSULTANT: [
    {
      groupName: "Vận Hành",
      items: [
        {
          title: "Tổng Quan",
          url: "/consultant",
          icon: PieChart,
        },
        {
          title: "Điều Phối (Workspace)",
          url: "/consultant/workspace",
          icon: Users,
        },
      ],
    },
    {
      groupName: "Quản Lý",
      items: [
        {
          title: "Duyệt Hồ Sơ Gia Sư",
          url: "/consultant/tutors",
          icon: UserCheck,
        },
        {
          title: "Quản Lý Lớp Học",
          url: "/consultant/classes",
          icon: MonitorPlay,
        },
        {
          title: "Quản Lý Giao Dịch",
          url: "/consultant/transactions",
          icon: Receipt,
        },
        {
          title: "Lịch Sử Hỗ Trợ",
          url: "/consultant/history",
          icon: History,
        },
      ],
    },
  ],
  ADMIN: [
    {
      groupName: "Hệ Thống",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
  ],
};
