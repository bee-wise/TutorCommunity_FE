import type { ComponentType } from "react";
import {
  AcademicCapIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CreditCardIcon,
  HomeIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  MessageCircle,
  History,
  LayoutDashboard,
  BookOpenCheck,
  UserCircle,
  PieChart,
  UserCheck,
  Users,
  MonitorPlay,
  Receipt,
  UsersRound,
  FolderCog,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  isActive?: boolean;
  openInNewTab?: boolean;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export type RoleNavigation = Record<string, NavGroup[]>;

export const navigationConfig: RoleNavigation = {
  LEARNER: [
    {
      groupName: "Tổng Quan",
      items: [
        { title: "Báo cáo học tập", url: "/lms/learner", icon: ChartBarIcon },
        { title: "Lịch học của tôi", url: "/lms/learner/schedule", icon: CalendarDaysIcon },
      ],
    },
    {
      groupName: "Học Tập",
      items: [
        {
          title: "Lớp học",
          url: "/lms/learner/classes",
          icon: AcademicCapIcon,
        },
        {
          title: "Tin nhắn lớp học",
          url: "/lms/learner/chat",
          icon: ChatBubbleLeftRightIcon,
        },
      ],
    },
    {
      groupName: "Gia sư",
      items: [
        {
          title: "Tìm gia sư mới",
          url: "https://beewise.vn",
          icon: UserPlusIcon,
          openInNewTab: true,
        },
      ],
    },
    {
      groupName: "Tài Khoản",
      items: [
        {
          title: "Theo dõi học phí",
          url: "/lms/learner/tuition-fee",
          icon: CreditCardIcon,
        },
        {
          title: "Lịch Sử Kết Nối",
          url: "/lms/learner/history",
          icon: ClockIcon,
        },
      ],
    },
  ],
  TUTOR: [
    {
      groupName: "Tổng Quan",
      items: [
        {
          title: "Tổng Quan",
          url: "/lms/tutor/dashboard",
          icon: HomeIcon,
        },
        {
          title: "Lịch Dạy",
          url: "/lms/tutor/schedule",
          icon: CalendarDaysIcon,
        },
      ],
    },
    {
      groupName: "Công Việc",
      items: [
        {
          title: "Quản Lý Lớp Học",
          url: "/lms/tutor/classes",
          icon: UsersIcon,
        },
        {
          title: "Chat kết nối & tư vấn",
          url: "/lms/tutor/messages",
          icon: ChatBubbleLeftRightIcon,
        },
      ],
    },
    {
      groupName: "Quản Trị Cá Nhân",
      items: [
        {
          title: "Thu Nhập & Thanh Toán",
          url: "/lms/tutor/earnings",
          icon: BanknotesIcon,
        },
        {
          title: "Lịch Sử Kết Nối",
          url: "/lms/tutor/history",
          icon: ClockIcon,
        },
        {
          title: "Hồ Sơ Của Tôi",
          url: "/lms/tutor/profile",
          icon: UserCircleIcon,
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
          title: "Hỗ Trợ Kết Nối (Chat)",
          url: "/consultant/workspace",
          icon: MessageCircle,
        },
        {
          title: "Yêu Cầu Kết Nối",
          url: "/consultant/connection-requests",
          icon: UsersRound,
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
          title: "Theo Dõi Lớp Học",
          url: "/consultant/classes",
          icon: MonitorPlay,
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
      groupName: "Tổng Quan",
      items: [
        {
          title: "Dashboard Vận Hành",
          url: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupName: "Quản Lý",
      items: [
        {
          title: "Quản Lý Consultant",
          url: "/admin/consultants",
          icon: Users,
        },
        {
          title: "Tài Khoản Hệ Thống",
          url: "/admin/accounts",
          icon: UserCircle,
        },
      ],
    },
    {
      groupName: "Hệ Thống",
      items: [
        {
          title: "Quản Lý Cấu Hình",
          url: "/admin/settings",
          icon: FolderCog,
        },
        {
          title: "Chương Trình Học",
          url: "/admin/learning-programs",
          icon: BookOpenCheck,
        },
        {
          title: "Quản Lý Rủi Ro",
          url: "/admin/risks",
          icon: Receipt,
        },
      ],
    },
  ],
};
