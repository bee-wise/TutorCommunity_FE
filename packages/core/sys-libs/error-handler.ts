import { AxiosError } from "axios";

export interface ApiErrorPayload {
  success?: boolean;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
  // Fallback for older flat structures
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Đã xảy ra lỗi. Vui lòng thử lại.",
) {
  const apiError = handleApiError(error);
  return apiError.message || fallbackMessage;
}

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public errors?: Record<string, string[]>;
  public retryAfterSeconds?: number;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: Record<string, string[]>,
    retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function parseRetryAfter(value: unknown): number | undefined {
  if (typeof value !== "string" && typeof value !== "number") return;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);
  if (typeof value === "string") {
    const date = Date.parse(value);
    if (Number.isFinite(date)) return Math.max(0, Math.ceil((date - Date.now()) / 1000));
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data as ApiErrorPayload;
      const status = error.response.status;

      let message = data?.error?.message || data?.message;
      if (!message) {
        switch (status) {
          case 400:
            message = "Dữ liệu không hợp lệ (Bad Request).";
            break;
          case 401:
            message =
              "Phiên đăng nhập hết hạn hoặc không có quyền (Unauthorized).";
            break;
          case 403:
            message = "Bạn không có quyền truy cập tài nguyên này (Forbidden).";
            break;
          case 404:
            message = "Không tìm thấy dữ liệu (Not Found).";
            break;
          case 429:
            message = "Bạn đã thao tác quá thường xuyên. Vui lòng thử lại sau.";
            break;
          case 500:
            message = "Lỗi hệ thống (Internal Server Error).";
            break;
          default:
            message = "Đã xảy ra lỗi từ máy chủ.";
        }
      }

      return new ApiError(
        message,
        status,
        data?.error?.code || data?.code,
        data?.error?.details || data?.errors,
        parseRetryAfter(error.response.headers?.["retry-after"]),
      );
    } else if (error.request) {
      return new ApiError(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        0,
        "NETWORK_ERROR",
      );
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, "RUNTIME_ERROR");
  }

  return new ApiError("Đã xảy ra lỗi không xác định.", 500, "UNKNOWN_ERROR");
}
