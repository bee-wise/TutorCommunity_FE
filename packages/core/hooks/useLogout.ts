import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch {
        // An expired session is already logged out from the user's perspective.
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
};
