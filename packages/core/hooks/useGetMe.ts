import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { queryKeys } from "../sys-libs/queryKeys";

export const useGetMe = () => {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [queryKeys.authKey.getMe],
    queryFn: async () => {
      setAuthLoading(true);

      try {
        const response = await authService.getMe();

        if (response.success && response.data) {
          login(response.data);
          return response.data;
        }

        queryClient.clear();
        logout();
        return null;
      } catch {
        queryClient.clear();
        logout();
        return null;
      } finally {
        setAuthLoading(false);
      }
    },
    retry: false,
  });
};
