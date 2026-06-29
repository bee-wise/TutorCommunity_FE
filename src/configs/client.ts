import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "@/src/sys-libs/error-handler";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: unknown) => {
    const apiError = handleApiError(error);

    if (apiError.statusCode === 401) {
      console.error(
        "Unauthorized access - Redirecting or Token Refresh needed",
      );
      // TODO: Thêm logic Refresh Token
    }

    return Promise.reject(apiError);
  },
);
