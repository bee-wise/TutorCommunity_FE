import { create } from "zustand";
import { MeType } from "../types/auth.type";

export type UserRole = "LEARNER" | "TUTOR" | "CONSULTANT" | "ADMIN";

interface AuthState {
  user: MeType | null;
  isAuthenticated: boolean;
  isLogin?: boolean;

  // Mock methods for testing
  login: (user: MeType) => void;
  logout: () => void;
  setIsLogin: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isMe: false,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setIsLogin: (v) => set({ isLogin: v }),
}));
