import { create } from "zustand";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: "system" | "course" | "tutor" | "payment";
  avatar?: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  filter: "all" | "unread";
  setFilter: (filter: "all" | "unread") => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  getFilteredNotifications: () => Notification[];
  getUnreadCount: () => number;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Chào mừng bạn đến với BeeWise",
    message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy hoàn thiện hồ sơ để có trải nghiệm tốt nhất.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
    type: "system",
  },
  {
    id: "2",
    title: "Gia sư mới phù hợp",
    message: "Gia sư Nguyễn Văn A chuyên ngành Toán Học vừa tham gia hệ thống.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    type: "tutor",
    avatar: "https://i.pravatar.cc/150?u=2",
    link: "/tutors/1",
  },
  {
    id: "3",
    title: "Lịch học sắp diễn ra",
    message: "Bạn có lịch học Tiếng Anh cơ bản với gia sư Trần Thị B vào 19:00 hôm nay.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    type: "course",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    title: "Thanh toán thành công",
    message: "Bạn đã thanh toán thành công khóa học Lập trình Web.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    type: "payment",
  }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  filter: "all",
  setFilter: (filter) => set({ filter }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  getFilteredNotifications: () => {
    const { notifications, filter } = get();
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  },
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));

// Sync unread count to global drawer store
useNotificationStore.subscribe((state) => {
  const unreadCount = state.notifications.filter((n) => !n.isRead).length;
  useNotificationDrawerStore.getState().setUnreadCount(unreadCount);
});

// Initial sync
if (typeof window !== "undefined") {
  useNotificationDrawerStore.getState().setUnreadCount(useNotificationStore.getState().getUnreadCount());
}
