import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";

export const useGetMe = () => {
  const login = useAuthStore((s) => s.login);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await authService.getMe();

      if (response.success) {
        login(response.data!);
      }
    },
  });
};
