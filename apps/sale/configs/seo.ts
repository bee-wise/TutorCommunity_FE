const DEFAULT_SALE_SITE_URL = "https://beewise.vn";

function resolveSiteUrl(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return fallback;
    }

    return url.origin;
  } catch {
    return fallback;
  }
}

export const saleSeoConfig = {
  siteUrl: resolveSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    DEFAULT_SALE_SITE_URL,
  ),
  indexableRoutes: ["/", "/tutors", "/tutor-guide", "/about-us"],
  privateRoutes: [
    "/learner/",
    "/tutor/",
    "/community/applications",
    "/community/my-posts",
    "/dev/",
  ],
} as const;

export function getSaleUrl(pathname: string): string {
  return new URL(pathname, `${saleSeoConfig.siteUrl}/`).toString();
}
