import { create } from "zustand";
import { MeType } from "../types/auth.type";

export type UserRole = "LEARNER" | "TUTOR" | "CONSULTANT" | "ADMIN";

interface AuthState {
  user: MeType | null;
  isAuthenticated: boolean;

  // Mock methods for testing
  isAuthLoading: boolean;
  setAuthLoading: (isAuthLoading: boolean) => void;
  login: (user: MeType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: false,

  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  login: (user) => set({ user, isAuthenticated: true, isAuthLoading: false }),
  logout: () =>
    set({ user: null, isAuthenticated: false, isAuthLoading: false }),
}));
