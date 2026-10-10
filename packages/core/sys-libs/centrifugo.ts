import { Centrifuge, UnauthorizedError, type Subscription } from "centrifuge";
import { chatRoomsService } from "../services/chat-rooms.service";
import { ApiError } from "./error-handler";

type RoomListener = () => void;
type RoomSubscription = {
  subscription: Subscription;
  listeners: Set<RoomListener>;
  isSubscribed: boolean;
};

let client: Centrifuge | null = null;
let clientUserId: string | null = null;
let clientConnected = false;
const connectionListeners = new Set<() => void>();
const roomSubscriptions = new Map<string, RoomSubscription>();

function notifyConnectionListeners() {
  connectionListeners.forEach((listener) => listener());
}

function setConnectionStatus(connected: boolean) {
  if (clientConnected === connected) return;
  clientConnected = connected;
  notifyConnectionListeners();
}

export function isChatRealtimeReady(userId: string | undefined): boolean {
  return Boolean(
    userId && clientUserId === userId && clientConnected &&
    roomSubscriptions.size > 0 &&
    [...roomSubscriptions.values()].every((room) => room.isSubscribed),
  );
}

export function subscribeToChatRealtimeStatus(listener: () => void): () => void {
  connectionListeners.add(listener);
  return () => connectionListeners.delete(listener);
}

function websocketUrl(): string | null {
  if (typeof window === "undefined") return null;
  const configured = process.env.NEXT_PUBLIC_CENTRIFUGO_WS_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (url.protocol !== "ws:" && url.protocol !== "wss:") return null;
    if (window.location.protocol === "https:" && url.protocol !== "wss:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function notifyRoom(roomId: string) {
  roomSubscriptions.get(roomId)?.listeners.forEach((listener) => listener());
}

function disconnectClient() {
  setConnectionStatus(false);
  roomSubscriptions.forEach(({ subscription }) => {
    subscription.unsubscribe();
    subscription.removeAllListeners();
    client?.removeSubscription(subscription);
  });
  roomSubscriptions.clear();
  client?.disconnect();
  client?.removeAllListeners();
  client = null;
  clientUserId = null;
}

function getClient(userId: string): Centrifuge | null {
  const url = websocketUrl();
  if (!url) return null;
  if (client && clientUserId !== userId) disconnectClient();
  if (client) return client;

  clientUserId = userId;
  client = new Centrifuge(url, {
    getToken: async () => {
      try {
        const response = await chatRoomsService.getCentrifugoToken();
        if (response.userId.toLowerCase() !== userId.toLowerCase()) {
          throw new UnauthorizedError("Phiên đăng nhập đã thay đổi.");
        }
        return response.token;
      } catch (error) {
        if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
          throw new UnauthorizedError("Không có quyền kết nối realtime.");
        }
        throw error;
      }
    },
  });

  // Also accept server-side subscriptions if the backend grants them in the token.
  client.on("publication", ({ channel }) => {
    if (channel.startsWith("chat:room:")) notifyRoom(channel.slice("chat:room:".length));
  });
  client.on("connected", () => {
    setConnectionStatus(true);
    roomSubscriptions.forEach((_, roomId) => notifyRoom(roomId));
  });
  const markUnavailable = () => {
    roomSubscriptions.forEach((room) => { room.isSubscribed = false; });
    setConnectionStatus(false);
  };
  client.on("connecting", markUnavailable);
  client.on("disconnected", markUnavailable);
  client.connect();
  return client;
}

export function subscribeToChatRoom(userId: string, roomId: string, listener: RoomListener): () => void {
  const instance = getClient(userId);
  if (!instance) return () => undefined;

  let room = roomSubscriptions.get(roomId);
  if (!room) {
    const channel = `chat:room:${roomId}`;
    const subscription = instance.newSubscription(channel, {
      getToken: async () => {
        try {
          const response = await chatRoomsService.getCentrifugoSubscriptionToken(roomId);
          if (response.channel !== channel) {
            throw new UnauthorizedError("Token không thuộc kênh phòng chat này.");
          }
          return response.token;
        } catch (error) {
          if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
            throw new UnauthorizedError("Không có quyền đăng ký kênh phòng chat.");
          }
          throw error;
        }
      },
    });
    const entry: RoomSubscription = { subscription, listeners: new Set(), isSubscribed: false };
    room = entry;
    roomSubscriptions.set(roomId, entry);
    notifyConnectionListeners();
    subscription.on("publication", () => notifyRoom(roomId));
    subscription.on("subscribed", () => {
      entry.isSubscribed = true;
      notifyConnectionListeners();
      notifyRoom(roomId);
    });
    subscription.on("unsubscribed", () => {
      entry.isSubscribed = false;
      notifyConnectionListeners();
    });
    subscription.subscribe();
  }
  room.listeners.add(listener);

  return () => {
    const current = roomSubscriptions.get(roomId);
    if (!current) return;
    current.listeners.delete(listener);
    if (current.listeners.size > 0) return;
    current.subscription.unsubscribe();
    current.subscription.removeAllListeners();
    instance.removeSubscription(current.subscription);
    roomSubscriptions.delete(roomId);
    notifyConnectionListeners();
    if (roomSubscriptions.size === 0) disconnectClient();
  };
}
