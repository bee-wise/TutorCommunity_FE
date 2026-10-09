"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe } from "@workspace/core/hooks/useGetMe";
import {
  getLmsRoleRedirectPath,
  normalizeLmsRole,
} from "../utils/lms-role";

export function useLmsRoleGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isPending, isFetching } = useGetMe({
    revalidateOnFocus: true,
  });
  const isChecking = isPending || isFetching;
  const role = normalizeLmsRole(user?.role);
  const redirectPath = isChecking
    ? null
    : getLmsRoleRedirectPath(pathname, role);

  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [redirectPath, router]);

  return {
    pathname,
    role,
    canRender: !isChecking && !redirectPath,
  };
}
