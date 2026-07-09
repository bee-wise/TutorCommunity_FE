import { create } from "zustand";
import { ToastPosition } from "./BeeToaster";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

function buildToast(
  variant: ToastVariant,
  title: string,
  options?: {
    description?: string;
    duration?: number;
    position?: ToastPosition;
  },
) {
  useToastStore.getState().add({ variant, title, ...options });
}

export const toast = {
  success: (
    title: string,
    options?: {
      description?: string;
      duration?: number;
      position?: ToastPosition;
    },
  ) => buildToast("success", title, options),
  error: (
    title: string,
    options?: {
      description?: string;
      duration?: number;
      position?: ToastPosition;
    },
  ) => buildToast("error", title, options),
  warning: (
    title: string,
    options?: {
      description?: string;
      duration?: number;
      position?: ToastPosition;
    },
  ) => buildToast("warning", title, options),
  info: (
    title: string,
    options?: {
      description?: string;
      duration?: number;
      position?: ToastPosition;
    },
  ) => buildToast("info", title, options),
};
