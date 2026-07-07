import { create } from "zustand";

export type UserRole = "LEARNER" | "TUTOR" | "CONSULTANT" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  // Mock methods for testing
  login: (user: UserProfile) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const MOCK_USERS: Record<UserRole, UserProfile> = {
  LEARNER: {
    id: "user-learner-1",
    name: "Học viên A",
    email: "learner@beewise.vn",
    role: "LEARNER",
    avatarUrl: "https://i.pravatar.cc/150?u=learner",
  },
  TUTOR: {
    id: "user-tutor-1",
    name: "Gia sư B",
    email: "tutor@beewise.vn",
    role: "TUTOR",
    avatarUrl: "https://i.pravatar.cc/150?u=tutor",
  },
  CONSULTANT: {
    id: "user-consultant-1",
    name: "Tư vấn viên C",
    email: "consultant@beewise.vn",
    role: "CONSULTANT",
    avatarUrl: "https://i.pravatar.cc/150?u=consultant",
  },
  ADMIN: {
    id: "user-admin-1",
    name: "Quản trị viên D",
    email: "admin@beewise.vn",
    role: "ADMIN",
    avatarUrl: "https://i.pravatar.cc/150?u=admin",
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  // Default logged in as LEARNER for development
  user: MOCK_USERS.LEARNER,
  isAuthenticated: true,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (role) => set({ user: MOCK_USERS[role], isAuthenticated: true }),
}));
