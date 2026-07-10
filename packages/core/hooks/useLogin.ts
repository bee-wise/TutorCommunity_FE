import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@workspace/core/services/auth.service";
import { LoginRequest } from "@workspace/core/types/auth.type";
import { queryKeys } from "../sys-libs/queryKeys";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { AUTH_MESSAGE } from "../constants/auth.message";
import { handleApiError } from "../sys-libs/error-handler";

export const useLogin = ({ redirectUrl }: { redirectUrl?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (req: LoginRequest) => {
      await authService.login(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.authKey.getMe] });
      toast.success(AUTH_MESSAGE.SUCCESS);
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    },
    onError: (error) => {
      const err = handleApiError(error);
      toast.error(err.message || AUTH_MESSAGE.ERROR.INTERNAL_SERVER_ERROR, {
        position: "top-right",
      });
    },
  });
};
