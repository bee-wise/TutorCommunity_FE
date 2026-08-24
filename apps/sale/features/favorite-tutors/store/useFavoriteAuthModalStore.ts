import { create } from "zustand";

interface FavoriteAuthModalState {
  isOpen: boolean;
  tutorName?: string;
  openModal: (tutorName?: string) => void;
  closeModal: () => void;
}

export const useFavoriteAuthModalStore = create<FavoriteAuthModalState>((set) => ({
  isOpen: false,
  tutorName: undefined,
  openModal: (tutorName) => set({ isOpen: true, tutorName }),
  closeModal: () => set({ isOpen: false, tutorName: undefined }),
}));
