import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.beewise.vn";

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

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: unknown) => {
    const apiError = handleApiError(error);
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config;

    if (
      apiError.statusCode === 401 &&
      originalRequest &&
      !(originalRequest as RetriableRequestConfig)._retry
    ) {
      if (originalRequest.url?.includes("/auth/me")) {
        return Promise.reject(apiError);
      }

      // Tránh lặp vô hạn nếu chính API refresh token cũng trả về 401
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(apiError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as RetriableRequestConfig)._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(apiError);
  },
);
