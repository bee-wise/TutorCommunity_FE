import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { AUTH_MESSAGE } from "../constants/auth.message";

export const useGetMe = () => {
  const login = useAuthStore((s) => s.login);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await authService.getMe();

        if (response.success) {
          login(response.data!);
        }

        return response.data;
      } catch (error) {
        useAuthStore.getState().logout();
        toast.error(AUTH_MESSAGE.ERROR.GET_ME_ERROR, {
          position: "top-right",
        });

        throw error;
      }
    },
    retry: false,
  });
};
