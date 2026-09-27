import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "@workspace/core/services/auth.service";
import { LoginRequest } from "@workspace/core/types/auth.type";
import { AUTH_MESSAGE } from "../constants/auth.message";
import { useAuthStore } from "../store/useAuthStore";
import {
  ApiError,
  getApiErrorMessage,
  handleApiError,
} from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import { getRoleRedirectPath } from "../utils/auth-redirect";

export const useLogin = ({
  redirectUrl,
  onSuccess,
  onLmsAccessNotActivated,
  loginScreen,
}: {
  redirectUrl?: string;
  onSuccess?: () => void;
  onLmsAccessNotActivated?: () => void;
  loginScreen: "SALE" | "LMS" | "STAFF";
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const setAuthenticatedUser = useAuthStore((s) => s.login);
  const clearAuth = useAuthStore((s) => s.logout);

  const handleUnauthorized = async () => {
    toast.warning(AUTH_MESSAGE.ERROR.FORBIDDEN, {
      position: "top-right",
    });
    try {
      await authService.logout();
    } catch {
    } finally {
      queryClient.clear();
      clearAuth();
    }
  };

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (req: LoginRequest) => {
      try {
        const loginResponse = await authService.login(
          {
            email: req.email.trim(),
            password: req.password,
          },
          loginScreen,
        );
        if (!loginResponse.success) {
          throw new ApiError(
            loginResponse.error?.message ||
              loginResponse.message ||
              AUTH_MESSAGE.ERROR.INTERNAL_SERVER_ERROR,
            loginResponse.error?.code === "LMS_ACCESS_NOT_ACTIVATED" ? 403 : 400,
            loginResponse.error?.code,
          );
        }

        const response = await authService.getMe();
        if (!response.success || !response.data) {
          throw new Error(AUTH_MESSAGE.ERROR.GET_ME_ERROR);
        }

        return response.data;
      } catch (error) {
        await authService.logout().catch(() => {});
        throw error;
      }
    },
    onMutate: () => {
      setAuthLoading(true);
    },
    onSuccess: async (user) => {
      setAuthenticatedUser(user);
      queryClient.setQueryData([queryKeys.authKey.getMe], user);
      toast.success(AUTH_MESSAGE.SUCCESS, { position: "top-right" });
      router.push(
        getRoleRedirectPath(
          user,
          {
            returnUrl: redirectUrl,
            preferReturnUrl: true,
          },
          loginScreen,
        ),
      );
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      if (
        loginScreen === "LMS" &&
        apiError.code === "LMS_ACCESS_NOT_ACTIVATED"
      ) {
        clearAuth();
        onLmsAccessNotActivated?.();
        return;
      }

      if (apiError.statusCode === 403) {
        return handleUnauthorized();
      }

      clearAuth();
      toast.error(
        getApiErrorMessage(error, AUTH_MESSAGE.ERROR.INTERNAL_SERVER_ERROR),
        { position: "top-right" },
      );
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });
};
