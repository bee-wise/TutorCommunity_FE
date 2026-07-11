import { apiClient } from "../configs/client";
import { ApiResponse } from "../types/api-response.type";
import {
  GetMeReponseType,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.type";

export const authService = {
  login: async (req: LoginRequest): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/login", req);
  },

  register: async (
    req: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> => {
    return await apiClient.post("/auth/register", req);
  },

  getMe: async (): Promise<GetMeReponseType> => {
    return await apiClient.get("/auth/me");
  },

  refresh: async (): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/refresh");
  },

  logout: async (): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/logout");
  },
};
