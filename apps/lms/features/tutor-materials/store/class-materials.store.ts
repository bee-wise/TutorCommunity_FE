"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { CLASS_MATERIALS, MATERIAL_CLASSES } from "../data/classroom.mock";
import type { ClassMaterial } from "../types/class-materials.types";
import { PersistedMaterialsSchema } from "../types/material.schemas";

export const MATERIAL_STORAGE_KEY = "beewise-class-materials-v1";
let storageFailed = false;
const safeStorage = createJSONStorage<{ materials: ClassMaterial[] }>(() => ({
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { storageFailed = true; return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch {
      if (!storageFailed) toast.warning("Không lưu được vào bộ nhớ trình duyệt", { description: "Thay đổi chỉ được giữ trong tab hiện tại; không tải lại hoặc đóng tab." });
      storageFailed = true;
    }
  },
  removeItem: (name) => { try { localStorage.removeItem(name); } catch { storageFailed = true; } },
}));
interface ClassMaterialsState {
  materials: ClassMaterial[];
  ready: boolean;
  storageError: string | null;
  addMaterial: (material: ClassMaterial) => void;
  updateMaterial: (
    id: string,
    changes: Partial<Pick<ClassMaterial, "title" | "status" | "data">>,
  ) => void;
}

export const useClassMaterialsStore = create<ClassMaterialsState>()(
  persist(
    (set, get) => ({
      materials: CLASS_MATERIALS,
      ready: false,
      storageError: null,
      addMaterial: (material) => {
        if (!canEditClass(material.classId)) return;
        set({ materials: [material, ...get().materials] });
      },
      updateMaterial: (id, changes) => {
        const material = get().materials.find((item) => item.id === id);
        if (!material || !canEditClass(material.classId)) return;
        set({
          materials: get().materials.map((item) =>
            item.id === id
              ? { ...item, ...changes, updatedAt: new Date().toISOString() }
              : item,
          ),
        });
      },
    }),
    {
      name: MATERIAL_STORAGE_KEY,
      version: 1,
      storage: safeStorage,
      skipHydration: true,
      partialize: (state) => ({ materials: state.materials }),
      merge: (persisted, current) => {
        const parsed = PersistedMaterialsSchema.safeParse({
          state: persisted,
          version: 1,
        });
        return parsed.success
          ? { ...current, materials: parsed.data.state.materials }
          : current;
      },
      onRehydrateStorage: () => (_state, error) => {
        // Defer the flag until hydration has finished applying the persisted state.
        queueMicrotask(() =>
          useClassMaterialsStore.setState({
            ready: true,
            storageError: error || storageFailed
              ? "Không đọc được bộ nhớ trình duyệt. Tài liệu có thể không được giữ khi tải lại trang."
              : null,
          }),
        );
      },
    },
  ),
);

export function canEditClass(classId: string) {
  return MATERIAL_CLASSES.some(
    (item) => item.id === classId && item.status !== "completed",
  );
}
