"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteTutorsService } from "@workspace/core/services/favorite-tutors.service";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { useFavoriteAuthModalStore } from "../store/useFavoriteAuthModalStore";
import type { ApiTutorProfile } from "../../tutor-list/data/types";
import type { FavoriteTutorsListParams } from "@workspace/core/types/favorite-tutors.type";

/**
 * Hook to query all favorite tutor IDs for quick lookup (heart active/inactive state).
 */
export function useFavoriteTutorIds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.favoriteTutors.ids,
    queryFn: async (): Promise<string[]> => {
      const response = await favoriteTutorsService.getFavoriteTutorIds();
      const rawData = response?.data;

      if (Array.isArray(rawData)) {
        return rawData;
      }

      if (rawData && typeof rawData === "object" && "ids" in rawData && Array.isArray((rawData as { ids: string[] }).ids)) {
        return (rawData as { ids: string[] }).ids;
      }

      return [];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to query learner's paginated list of favorite tutors.
 */
export function useFavoriteTutorsList(params?: FavoriteTutorsListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.favoriteTutors.list(params),
    queryFn: async () => {
      const response = await favoriteTutorsService.getFavoriteTutors(params);
      const rawData = response?.data;

      if (!rawData) {
        return {
          items: [] as ApiTutorProfile[],
          pagination: undefined,
        };
      }

      if (Array.isArray(rawData)) {
        return {
          items: rawData as unknown as ApiTutorProfile[],
          pagination: undefined,
        };
      }

      const paginatedData = rawData as {
        items?: ApiTutorProfile[];
        pagination?: {
          page: number;
          pageSize: number;
          totalItems: number;
          totalPages: number;
        };
      };

      return {
        items: (paginatedData.items || []) as ApiTutorProfile[],
        pagination: paginatedData.pagination,
      };
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Mutation hook to add/remove a tutor from favorites with optimistic updates.
 */
export function useToggleFavoriteTutorMutation() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useFavoriteAuthModalStore((s) => s.openModal);
  const { add: addToast } = useToastStore();

  const mutation = useMutation({
    mutationFn: async ({
      tutorId,
      isCurrentlySaved,
    }: {
      tutorId: string;
      tutorName?: string;
      isCurrentlySaved: boolean;
    }) => {
      if (isCurrentlySaved) {
        return await favoriteTutorsService.removeFavoriteTutor(tutorId);
      }
      return await favoriteTutorsService.addFavoriteTutor(tutorId);
    },
    onMutate: async ({ tutorId, isCurrentlySaved }) => {
      // Cancel ongoing queries for IDs
      await queryClient.cancelQueries({ queryKey: queryKeys.favoriteTutors.ids });

      // Snapshot previous IDs
      const previousIds = queryClient.getQueryData<string[]>(queryKeys.favoriteTutors.ids) || [];

      // Optimistically update IDs
      let nextIds: string[];
      if (isCurrentlySaved) {
        nextIds = previousIds.filter((id) => id !== tutorId);
      } else {
        nextIds = previousIds.includes(tutorId) ? previousIds : [...previousIds, tutorId];
      }

      queryClient.setQueryData(queryKeys.favoriteTutors.ids, nextIds);

      return { previousIds };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousIds) {
        queryClient.setQueryData(queryKeys.favoriteTutors.ids, context.previousIds);
      }
      addToast({
        title: "Không thể cập nhật",
        description: "Đã xảy ra lỗi khi lưu gia sư. Vui lòng thử lại.",
        variant: "error",
      });
    },
    onSuccess: (_data, variables) => {
      if (variables.isCurrentlySaved) {
        addToast({
          title: "Đã bỏ lưu gia sư",
          description: variables.tutorName
            ? `Đã xóa gia sư ${variables.tutorName} khỏi danh sách yêu thích.`
            : "Đã xóa gia sư khỏi danh sách yêu thích.",
          variant: "info",
        });
      } else {
        addToast({
          title: "Đã lưu gia sư",
          description: variables.tutorName
            ? `Đã thêm gia sư ${variables.tutorName} vào danh sách yêu thích.`
            : "Đã thêm gia sư vào danh sách yêu thích.",
          variant: "success",
        });
      }
    },
    onSettled: () => {
      // Invalidate queries to sync with backend
      queryClient.invalidateQueries({ queryKey: queryKeys.favoriteTutors.all });
    },
  });

  const toggleFavorite = ({
    tutorId,
    tutorName,
    isCurrentlySaved,
  }: {
    tutorId: string;
    tutorName?: string;
    isCurrentlySaved: boolean;
  }) => {
    if (!isAuthenticated) {
      openAuthModal(tutorName);
      return;
    }

    mutation.mutate({ tutorId, tutorName, isCurrentlySaved });
  };

  return {
    toggleFavorite,
    isPending: mutation.isPending,
  };
}

/**
 * Unified Favorite Tutors Hook for components.
 */
export function useFavoriteTutors(params?: FavoriteTutorsListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const { data: savedIds = [], isLoading: isIdsLoading } = useFavoriteTutorIds();
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
    refetch,
  } = useFavoriteTutorsList(params);
  const { toggleFavorite, isPending: isMutating } = useToggleFavoriteTutorMutation();

  const isFavorite = (tutorId?: string | null) => {
    if (!tutorId || !isAuthenticated) return false;
    return savedIds.includes(tutorId);
  };

  return {
    isAuthenticated,
    isAuthLoading,
    savedIds,
    isFavorite,
    favoriteTutors: listData?.items || [],
    pagination: listData?.pagination,
    isLoading: isIdsLoading || isListLoading,
    isError: isListError,
    toggleFavorite,
    isMutating,
    refetch,
  };
}
