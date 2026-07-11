"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouteStore } from "@workspace/core/store/useRouteStore";

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setLastNonAuthRoute = useRouteStore((state) => state.setLastNonAuthRoute);

  useEffect(() => {
    if (!pathname) return;
    
    // Check if the current route is NOT an auth route
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password");
    
    if (!isAuthRoute) {
      // Reconstruct the full path with search params if any
      const paramsString = searchParams?.toString();
      const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;
      setLastNonAuthRoute(fullPath);
    }
  }, [pathname, searchParams, setLastNonAuthRoute]);

  return null;
}
