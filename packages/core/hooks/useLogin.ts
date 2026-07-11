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
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (req: LoginRequest) => {
      await authService.login(req);
      const meResponse = await authService.getMe();
      return meResponse;
    },
    onSuccess: async (res) => {
      if (res.success) {
        if (redirectUrl) {
          router.push(redirectUrl);
        }
        onSuccess?.();
      } else {
        logout();
        throw new Error(AUTH_MESSAGE.ERROR.GET_ME_ERROR);
      }
    },
    onError: () => {
      toast.error(AUTH_MESSAGE.ERROR.INTERNAL_SERVER_ERROR, {
        position: "top-right",
      });
    },
  });
};
