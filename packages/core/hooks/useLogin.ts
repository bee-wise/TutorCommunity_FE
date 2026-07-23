import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "@workspace/core/services/auth.service";
import { LoginRequest } from "@workspace/core/types/auth.type";
import { AUTH_MESSAGE } from "../constants/auth.message";
import { useAuthStore } from "../store/useAuthStore";
import { getApiErrorMessage, handleApiError } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import { getRoleRedirectPath } from "../utils/auth-redirect";

export const useLogin = ({
  redirectUrl,
  onSuccess,
  loginScreen,
}: {
  redirectUrl?: string;
  onSuccess?: () => void;
  loginScreen: "SALE" | "LMS" | "STAFF";
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const setAuthenticatedUser = useAuthStore((s) => s.login);
  const setIsOpenAccessLMSConfirm = useAuthStore(
    (s) => s.setIsOpenAccessLMSConfirm,
  );
  const clearAuth = useAuthStore((s) => s.logout);

  const handleUnauthorized = async () => {
    toast.warning(AUTH_MESSAGE.ERROR.FORBIDDEN, {
      position: "top-right",
    });
    try {
      await authService.logout();
    } catch {
    } finally {
      clearAuth();
    }
  };

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (req: LoginRequest) => {
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
    onMutate: () => {
      setAuthLoading(true);
    },
    onSuccess: async (user) => {
      if (loginScreen === "SALE") {
        setIsOpenAccessLMSConfirm(false);
        if (user.role !== "TUTOR" && user.role !== "LEARNER") {
          return handleUnauthorized();
        }
      } else if (loginScreen === "LMS") {
        if (user.role !== "TUTOR" && user.role !== "LEARNER") {
          return handleUnauthorized();
        }
        if (!user.canAccessTutorLms && user.role === "TUTOR") {
          setIsOpenAccessLMSConfirm(true);
          await authService.logout();
          clearAuth();
          return;
        }
        if (!user.canAccessLearnerLms && user.role === "LEARNER") {
          setIsOpenAccessLMSConfirm(true);
          await authService.logout();
          clearAuth();
          return;
        }
      } else if (loginScreen === "STAFF") {
        if (user.role !== "ADMIN" && user.role !== "CONSULTANT") {
          return handleUnauthorized();
        }
      }

      setIsOpenAccessLMSConfirm(false);
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
