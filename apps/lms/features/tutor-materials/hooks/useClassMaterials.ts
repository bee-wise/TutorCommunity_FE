"use client";

import { useEffect } from "react";
import {
  MATERIAL_STORAGE_KEY,
  useClassMaterialsStore,
} from "../store/class-materials.store";
import { PersistedMaterialsSchema } from "../types/material.schemas";

let hydrationStarted = false;
export function useClassMaterials() {
  const state = useClassMaterialsStore();
  useEffect(() => {
    if (!hydrationStarted) {
      hydrationStarted = true;
      void useClassMaterialsStore.persist.rehydrate();
    }
    const sync = (event: StorageEvent) => {
      if (event.key !== MATERIAL_STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = PersistedMaterialsSchema.safeParse(
          JSON.parse(event.newValue) as unknown,
        );
        if (parsed.success && JSON.stringify(parsed.data.state.materials) !== JSON.stringify(useClassMaterialsStore.getState().materials))
          useClassMaterialsStore.setState({
            materials: parsed.data.state.materials,
          });
      } catch {
        /* Ignore malformed writes from unrelated or outdated tabs. */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return state;
}
