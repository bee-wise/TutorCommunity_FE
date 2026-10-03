import { create } from "zustand";

export type CentrifugoConnectionStatus = "disconnected" | "connecting" | "connected";

interface CentrifugoState {
  status: CentrifugoConnectionStatus;
  error: string | null;
  setStatus: (status: CentrifugoConnectionStatus) => void;
  setError: (error: string | null) => void;
}

export const useCentrifugoStore = create<CentrifugoState>((set) => ({
  status: "disconnected",
  error: null,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
