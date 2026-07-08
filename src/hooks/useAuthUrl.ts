import { usePathname, useSearchParams } from "next/navigation";

export function useAuthUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = `${pathname}${
    searchParams?.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return {
    currentUrl,
    loginUrl: `/login?callbackUrl=${encodeURIComponent(currentUrl)}`,
    registerUrl: `/register?callbackUrl=${encodeURIComponent(currentUrl)}`,
  };
}
