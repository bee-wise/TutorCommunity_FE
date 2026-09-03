const DEFAULT_LMS_SITE_URL = "https://superlms.beewise.vn";

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

export const lmsSeoConfig = {
  siteUrl: resolveSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
    DEFAULT_LMS_SITE_URL,
  ),
} as const;

export function getLmsUrl(pathname: string): string {
  return new URL(pathname, `${lmsSeoConfig.siteUrl}/`).toString();
}
