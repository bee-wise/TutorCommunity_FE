import { AxiosError } from "axios";

export interface ApiErrorPayload {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data as ApiErrorPayload;
      const status = error.response.status;

      let message = data?.message;
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
          case 500:
            message = "Lỗi hệ thống (Internal Server Error).";
            break;
          default:
            message = "Đã xảy ra lỗi từ máy chủ.";
        }
      }

      return new ApiError(message, status, data?.code, data?.errors);
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
