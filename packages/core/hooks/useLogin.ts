import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@workspace/core/services/auth.service";
import { LoginRequest } from "@workspace/core/types/auth.type";
import { queryKeys } from "../sys-libs/queryKeys";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { AUTH_MESSAGE } from "../constants/auth.message";
import { handleApiError } from "../sys-libs/error-handler";
import { useAuthStore } from "../store/useAuthStore";

export const useLogin = ({
  redirectUrl,
  onSuccess,
}: {
  redirectUrl?: string;
  onSuccess?: () => void;
}) => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],

    mutationFn: async (req: LoginRequest) => {
      await authService.login(req);

      try {
        const me = await authService.getMe();

        if (!me.success) {
          throw new Error(AUTH_MESSAGE.ERROR.GET_ME_ERROR);
        }

        return me.data;
      } catch (error) {
        await authService.logout().catch(() => {});
        throw error;
      }
    },

    onSuccess: () => {
      onSuccess?.();

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    },

    onError: (error) => {
      handleApiError(error);
      toast.error(AUTH_MESSAGE.ERROR.INTERNAL_SERVER_ERROR, {
        position: "top-right",
      });
    },
  });
};
