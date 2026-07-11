import { create } from "zustand";

interface RouteState {
  lastNonAuthRoute: string;
  setLastNonAuthRoute: (route: string) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  lastNonAuthRoute: "/",
  setLastNonAuthRoute: (route) => set({ lastNonAuthRoute: route }),
}));
