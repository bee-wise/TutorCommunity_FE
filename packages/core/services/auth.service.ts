import { apiClient } from "../configs/client";
import { ApiResponse } from "../types/api-response.type";
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  GetMeReponseType,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "../types/auth.type";

const passwordRequestConfig = {
  headers: { "Content-Type": "application/json", "X-BeeWise-CSRF": "1" },
  withCredentials: true,
};

export const authService = {
  login: async (
    req: LoginRequest,
    app?: "SALE" | "LMS" | "STAFF"
  ): Promise<ApiResponse<undefined>> => {
    const endpoint = app ? `/auth/login/${app.toLowerCase()}` : "/auth/login";
    return await apiClient.post(endpoint, req);
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

  forgotPassword: async (
    req: ForgotPasswordRequest,
  ): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/forgot-password", req, passwordRequestConfig);
  },

  resetPassword: async (
    req: ResetPasswordRequest,
  ): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/reset-password", req, passwordRequestConfig);
  },

  changePassword: async (
    req: ChangePasswordRequest,
  ): Promise<ApiResponse<undefined>> => {
    return await apiClient.post("/auth/change-password", req, passwordRequestConfig);
  },
};
