import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
    }

    return Promise.reject(apiError);
  },
);
