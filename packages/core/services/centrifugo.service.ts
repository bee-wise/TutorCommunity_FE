import { apiClient } from "../configs/client";
import { ApiResponse } from "../types/api-response.type";
import {
  CentrifugoHealthResponse,
  CentrifugoSubscriptionTokenResponse,
  CentrifugoTokenResponse,
} from "../types/centrifugo.type";

export const centrifugoService = {
  /**
   * Cấp token kết nối Centrifugo ngắn hạn cho người dùng đang đăng nhập.
   * Yêu cầu quyền centrifugo_token.read.
   */
  getConnectionToken: async (): Promise<ApiResponse<CentrifugoTokenResponse>> => {
    return await apiClient.get("/realtime/centrifugo/token");
  },

  /**
   * Cấp token đăng ký kênh (subscription token) sau khi kiểm tra quyền.
   * - Nếu cung cấp chatRoomId: cấp subscription JWT cho kênh `chat:room:{chatRoomId}`.
   * - Nếu không truyền chatRoomId: cấp token cho kênh thông báo cá nhân `notification:{userId}`.
   */
  getSubscriptionToken: async (
    chatRoomId?: string,
  ): Promise<ApiResponse<CentrifugoSubscriptionTokenResponse>> => {
    return await apiClient.get("/realtime/centrifugo/subscription-token", {
      params: chatRoomId ? { chatRoomId } : undefined,
    });
  },

  /**
   * Kiểm tra tình trạng kết nối tới máy chủ realtime Centrifugo (Public).
   */
  getHealth: async (): Promise<ApiResponse<CentrifugoHealthResponse>> => {
    return await apiClient.get("/health/centrifugo");
  },
};
