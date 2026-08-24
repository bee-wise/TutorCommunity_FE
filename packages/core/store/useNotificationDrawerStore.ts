import { create } from "zustand";

interface NotificationDrawerState {
  isOpen: boolean;
  unreadCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationDrawerStore = create<NotificationDrawerState>((set) => ({
  isOpen: false,
  unreadCount: 0,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
