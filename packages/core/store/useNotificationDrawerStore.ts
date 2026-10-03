import { create } from "zustand";

interface NotificationDrawerState {
  isOpen: boolean;
  unreadCount: number | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setUnreadCount: (count: number | null) => void;
}

export const useNotificationDrawerStore = create<NotificationDrawerState>((set) => ({
  isOpen: false,
  unreadCount: null,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
