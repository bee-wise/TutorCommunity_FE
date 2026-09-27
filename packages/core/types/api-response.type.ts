export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  error?: {
    code?: string;
    message?: string;
  };
  data?: T;
};
