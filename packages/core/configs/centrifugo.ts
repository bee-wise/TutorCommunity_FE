import {
  Centrifuge,
  DisconnectedContext,
  ErrorContext,
} from "centrifuge";
import { centrifugoService } from "../services/centrifugo.service";
import { useCentrifugoStore } from "../store/useCentrifugoStore";

export const getCentrifugoUrl = (webSocketUrl?: string | null): string => {
  const configuredUrl = webSocketUrl?.trim() || process.env.NEXT_PUBLIC_CENTRIFUGO_WS_URL;
  if (configuredUrl) {
    let normalized = configuredUrl.trim();
    if (normalized.startsWith("http://")) {
      normalized = "ws://" + normalized.slice(7);
    } else if (normalized.startsWith("https://")) {
      normalized = "wss://" + normalized.slice(8);
    }
    if (!normalized.endsWith("/connection/websocket")) {
      normalized = normalized.replace(/\/+$/, "") + "/connection/websocket";
    }
    return normalized;
  }
  return "wss://centrifugo.beewise.vn/connection/websocket";
};

let centrifugeInstance: Centrifuge | null = null;

export function getCentrifuge(token?: string, webSocketUrl?: string | null): Centrifuge | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!centrifugeInstance) {
    const wsUrl = getCentrifugoUrl(webSocketUrl);
    centrifugeInstance = new Centrifuge(wsUrl, {
      token: token || undefined,
      // Tự động lấy và làm mới connection token từ backend API /realtime/centrifugo/token
      getToken: async () => {
        try {
          const res = await centrifugoService.getConnectionToken();
          if (res.success && res.data?.token) {
            return res.data.token;
          }
        } catch {
          // Chưa đăng nhập hoặc không có quyền centrifugo_token.read
        }
        return "";
      },
      minReconnectDelay: 1000,
      maxReconnectDelay: 10000,
    });

    centrifugeInstance.on("connecting", () => {
      useCentrifugoStore.getState().setStatus("connecting");
      useCentrifugoStore.getState().setError(null);
    });

    centrifugeInstance.on("connected", () => {
      useCentrifugoStore.getState().setStatus("connected");
      useCentrifugoStore.getState().setError(null);
    });

    centrifugeInstance.on("disconnected", (ctx: DisconnectedContext) => {
      useCentrifugoStore.getState().setStatus("disconnected");
      if (ctx.reason && ctx.code !== 1000) {
        useCentrifugoStore.getState().setError(`Disconnected: ${ctx.reason} (code ${ctx.code})`);
      }
    });

    centrifugeInstance.on("error", (ctx: ErrorContext) => {
      useCentrifugoStore.getState().setError(ctx.error?.message || "Centrifugo connection error");
    });
  } else if (token) {
    centrifugeInstance.setToken(token);
  }

  return centrifugeInstance;
}

export function connectCentrifugo(token?: string, webSocketUrl?: string | null): void {
  const client = getCentrifuge(token, webSocketUrl);
  if (client) {
    if (token) {
      client.setToken(token);
    }
    client.connect();
  }
}

export function disconnectCentrifugo(): void {
  if (centrifugeInstance) {
    centrifugeInstance.disconnect();
    centrifugeInstance = null;
    useCentrifugoStore.getState().setStatus("disconnected");
  }
}

export function setCentrifugoToken(token: string): void {
  if (centrifugeInstance) {
    centrifugeInstance.setToken(token);
  }
}
