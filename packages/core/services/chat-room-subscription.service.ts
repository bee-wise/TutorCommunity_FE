import { SubscriptionState } from "centrifuge";
import { connectCentrifugo, getCentrifuge } from "../configs/centrifugo";
import { centrifugoService } from "./centrifugo.service";
import { useCentrifugoStore } from "../store/useCentrifugoStore";

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
    await existing.ready(15_000);
    return;
  }
  const grant = await centrifugoService.getSubscriptionToken(roomId);
  if (!grant.success || !grant.data?.token || grant.data.channel !== channel) {
    throw new Error("Không thể đăng ký phòng chat. Vui lòng thử lại.");
  }

  let subscription = existing;
  const createdHere = !subscription;
  if (!subscription) {
    subscription = client.newSubscription(channel, {
      token: grant.data.token,
      getToken: async () => {
        const renewed = await centrifugoService.getSubscriptionToken(roomId);
        if (!renewed.success || !renewed.data?.token || renewed.data.channel !== channel) {
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
    throw error;
  }
}
