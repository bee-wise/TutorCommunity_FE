import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast";

export const useGetMe = () => {
  const login = useAuthStore((s) => s.login);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await authService.getMe();

      if (response.success) {
        login(response.data!);
      }

      return response.data;
    },
  });
};
