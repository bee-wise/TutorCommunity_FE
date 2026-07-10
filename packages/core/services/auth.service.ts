import { apiClient } from "../configs/client";
import { ApiResponse } from "../types/api-response.type";
import { GetMeReponseType, LoginRequest } from "../types/auth.type";

export const authService = {
  login: async (req: LoginRequest): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/login", req);
  },

  getMe: async (): Promise<GetMeReponseType> => {
    return await apiClient.get("/auth/me");
  },

  logout: async (): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/logout");
  },
};
