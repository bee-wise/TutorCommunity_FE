import { SubscriptionState } from "centrifuge";
import { connectCentrifugo, getCentrifuge } from "../configs/centrifugo";
import { centrifugoService } from "./centrifugo.service";
import { useCentrifugoStore } from "../store/useCentrifugoStore";

function describeSubscriptionFailure(error: unknown): Error {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === 1) {
    return new Error("Dịch vụ trò chuyện chưa xác nhận kết nối sau 15 giây. Bạn có thể mở chat ngay và kết nối realtime sau.");
  }
  if (code === 7) {
    return new Error("Đăng ký phòng chat bị gián đoạn. Vui lòng thử kết nối lại hoặc mở chat ngay.");
  }
  if (code === 8 || code === 9) {
    return new Error("Quyền truy cập phòng chat realtime chưa sẵn sàng. Vui lòng thử kết nối lại.");
  }
  if (useCentrifugoStore.getState().status === "disconnected") {
    return new Error("Dịch vụ trò chuyện realtime đang mất kết nối. Bạn vẫn có thể mở chat ngay.");
  }
  return error instanceof Error
    ? error
    : new Error("Không thể đăng ký phòng chat realtime. Vui lòng thử lại hoặc mở chat ngay.");
}

/** Wait for the actual Centrifugo subscription before opening a newly created chat. */
export async function ensureChatRoomSubscribed(roomId: string): Promise<void> {
  if (useCentrifugoStore.getState().status === "disconnected") {
    const connection = await centrifugoService.getConnectionToken();
    if (!connection.success || !connection.data?.token) {
      throw new Error("Không thể kết nối dịch vụ trò chuyện. Vui lòng thử lại.");
    }
    connectCentrifugo(connection.data.token, connection.data.webSocketUrl);
  }

  const client = getCentrifuge();
  if (!client) throw new Error("Không thể khởi tạo kết nối trò chuyện.");

  const channel = `chat:room:${roomId}`;
  const existing = client.getSubscription(channel);
  if (existing?.state === SubscriptionState.Subscribed) {
    try {
      await existing.ready(15_000);
    } catch (error) {
      throw describeSubscriptionFailure(error);
    }
    return;
  }
  const grant = await centrifugoService.getSubscriptionToken(roomId);
  if (!grant.success || !grant.data?.token || (grant.data.channel && grant.data.channel !== channel)) {
    throw new Error("Không thể đăng ký phòng chat. Vui lòng thử lại.");
  }

  let subscription = existing;
  const createdHere = !subscription;
  if (!subscription) {
    subscription = client.newSubscription(channel, {
      token: grant.data.token,
      getToken: async () => {
        const renewed = await centrifugoService.getSubscriptionToken(roomId);
        if (!renewed.success || !renewed.data?.token || (renewed.data.channel && renewed.data.channel !== channel)) {
          throw new Error("Không thể làm mới quyền truy cập phòng chat.");
        }
        return renewed.data.token;
      },
    });
  }

  if (subscription.state === SubscriptionState.Unsubscribed) subscription.subscribe();
  try {
    await subscription.ready(15_000);
  } catch (error) {
    if (createdHere) {
      subscription.unsubscribe();
      client.removeSubscription(subscription);
    }
    throw describeSubscriptionFailure(error);
  }
}
