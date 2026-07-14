import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { queryKeys } from "../sys-libs/queryKeys";

export const useGetMe = () => {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);

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

        logout();
        return null;
      } catch {
        logout();
        return null;
      } finally {
        setAuthLoading(false);
      }
    },
    retry: false,
  });
};
