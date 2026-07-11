import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "@workspace/core/services/auth.service";
import { LoginRequest } from "@workspace/core/types/auth.type";
import { AUTH_MESSAGE } from "../constants/auth.message";
import { useAuthStore } from "../store/useAuthStore";
import { getApiErrorMessage } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import { getRoleRedirectPath } from "../utils/auth-redirect";

export const useLogin = ({
  redirectUrl,
  onSuccess,
}: {
  redirectUrl?: string;
  onSuccess?: () => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const setAuthenticatedUser = useAuthStore((s) => s.login);
  const clearAuth = useAuthStore((s) => s.logout);

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (req: LoginRequest) => {
      setAuthLoading(true);

      try {
        await authService.login({
          email: req.email.trim(),
          password: req.password,
        });

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
    onSuccess: (user) => {
      setAuthenticatedUser(user);
      queryClient.setQueryData([queryKeys.authKey.getMe], user);
      toast.success(AUTH_MESSAGE.SUCCESS, { position: "top-right" });
      router.push(
        getRoleRedirectPath(user, {
          returnUrl: redirectUrl,
          preferReturnUrl: true,
        }),
      );
      onSuccess?.();
    },
    onError: (error) => {
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
