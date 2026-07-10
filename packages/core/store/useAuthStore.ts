import { create } from "zustand";
import { MeType } from "../types/auth.type";

export type UserRole = "LEARNER" | "TUTOR" | "CONSULTANT" | "ADMIN";

interface AuthState {
  user: MeType | null;
  isAuthenticated: boolean;
  // Mock methods for testing
  login: (user: MeType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
