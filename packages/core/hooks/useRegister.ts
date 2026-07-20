import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { RegisterRequest } from "../types/auth.type";
import { getApiErrorMessage, handleApiError } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import { getRoleRedirectPath } from "../utils/auth-redirect";

export const REGISTER_SUCCESS_LOGIN_REQUIRED =
  "Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.";

export const useRegister = ({
  redirectUrl,
  onSuccess,
}: {
  redirectUrl?: string;
  onSuccess?: () => void;
} = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const setAuthenticatedUser = useAuthStore((s) => s.login);
  const clearAuth = useAuthStore((s) => s.logout);

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (req: RegisterRequest) => {
      setAuthLoading(true);
      const registerResponse = await authService.register(req);

      if (!registerResponse.success) {
        throw new Error(
          registerResponse.message || "Đăng ký không thành công.",
        );
      }

      try {
        const meResponse = await authService.getMe();
        if (meResponse.success && meResponse.data) {
          return { user: meResponse.data, sessionCreated: true };
        }
      } catch (error) {
        const apiError = handleApiError(error);
        if (apiError.statusCode !== 401) throw error;
      }

      return { user: null, sessionCreated: false };
    },
    onSuccess: ({ user, sessionCreated }, req) => {
      if (sessionCreated && user) {
        setAuthenticatedUser(user);
        queryClient.setQueryData([queryKeys.authKey.getMe], user);
        toast.success("Đăng ký tài khoản thành công.");
        router.push(
          getRoleRedirectPath(user, {
            returnUrl: redirectUrl,
            preferReturnUrl: true,
          }),
        );
        onSuccess?.();
        return;
      }

      clearAuth();
      toast.success(REGISTER_SUCCESS_LOGIN_REQUIRED);
      router.push(`/login?email=${encodeURIComponent(req.email)}`);
      onSuccess?.();
    },
    onError: (error) => {
      clearAuth();
      toast.error(getApiErrorMessage(error, "Đăng ký không thành công."), {
        position: "top-right",
      });
    },
  });
};
