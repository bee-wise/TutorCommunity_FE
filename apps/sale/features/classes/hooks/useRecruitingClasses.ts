"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { groupClassesService } from "@workspace/core/lms-classes/group.service";

export const RECRUITING_PAGE_SIZE = 20;

export function useRecruitingClasses() {
  const query = useInfiniteQuery({
    queryKey: ["recruiting-group-classes"],
    queryFn: ({ pageParam, signal }) =>
      groupClassesService.recruitment(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length >= RECRUITING_PAGE_SIZE ? pages.length + 1 : undefined,
    staleTime: 30 * 1000,
  });

  return {
    classes: query.data?.pages.flat() ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
