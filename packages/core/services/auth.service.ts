import { apiClient } from "@workspace/core/apiClient";
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
import {
  googleChallengeSchema,
  googleExchangeSchema,
  googleLinkSchema,
  googleRegistrationSchema,
  type GoogleChallengeData,
  type GoogleExchangeData,
  type GoogleLinkRequest,
  type GoogleRegistrationRequest,
} from "../schemas/google-auth.schema";
import { ApiError } from "../sys-libs/error-handler";

const passwordRequestConfig = {
  headers: { "Content-Type": "application/json", "X-BeeWise-CSRF": "1" },
  withCredentials: true,
};

const googleRequestConfig = {
  headers: { "Content-Type": "application/json", "X-BeeWise-CSRF": "1" },
  withCredentials: true,
};

function requireGoogleData<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || !response.data) {
    throw new ApiError(response.error?.message || response.message || fallback, 400, response.error?.code);
  }
  return response.data;
}

function requireGoogleSuccess(response: ApiResponse<unknown>, fallback: string): void {
  if (!response.success) {
    throw new ApiError(response.error?.message || response.message || fallback, 400, response.error?.code);
  }
}

export const authService = {
  googleChallenge: async (application: "SALE" | "LMS"): Promise<GoogleChallengeData> => {
    const response = await apiClient.post<ApiResponse<unknown>, ApiResponse<unknown>>(
      "/auth/google/challenge",
      { application },
      googleRequestConfig,
    );
    return googleChallengeSchema.parse(requireGoogleData(response, "Không thể bắt đầu đăng nhập Google."));
  },

  googleExchange: async (idToken: string): Promise<GoogleExchangeData> => {
    const response = await apiClient.post<ApiResponse<unknown>, ApiResponse<unknown>>(
      "/auth/google",
      { idToken },
      googleRequestConfig,
    );
    return googleExchangeSchema.parse(requireGoogleData(response, "Không thể xác minh tài khoản Google."));
  },

  googleRegister: async (request: GoogleRegistrationRequest): Promise<void> => {
    const response = await apiClient.post<ApiResponse<unknown>, ApiResponse<unknown>>(
      "/auth/google/register",
      googleRegistrationSchema.parse(request),
      googleRequestConfig,
    );
    requireGoogleSuccess(response, "Không thể tạo tài khoản Google.");
  },

  googleLink: async (request: GoogleLinkRequest): Promise<void> => {
    const response = await apiClient.post<ApiResponse<unknown>, ApiResponse<unknown>>(
      "/auth/google/link",
      googleLinkSchema.parse(request),
      googleRequestConfig,
    );
    requireGoogleSuccess(response, "Không thể liên kết tài khoản Google.");
  },
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
