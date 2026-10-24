"use client";

import { useEffect } from "react";
import { useRecruitingClasses } from "./useRecruitingClasses";

// Recruiting classes are only exposed as a list, so a class is found by paging through that
// list (shared cache with /classes) until it shows up or the pages run out.
export function useRecruitingClass(classId: string) {
  const {
    classes,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useRecruitingClasses();
  const classItem = classes.find((item) => item.id.toLowerCase() === classId.toLowerCase());
  const failed = !classItem && (isError || isFetchNextPageError);
  const searching = !classItem && !failed && !isLoading && hasNextPage;

  useEffect(() => {
    if (searching && !isFetchingNextPage) void fetchNextPage();
  }, [searching, isFetchingNextPage, fetchNextPage]);

  return {
    classItem,
    isLoading: !classItem && !failed && (isLoading || searching),
    isError: failed,
    notFound: !classItem && !failed && !isLoading && !searching,
    refetch,
    fetchNextPage,
  };
}
