const PUBLIC_HOSTS = new Set(["beewise.vn", "www.beewise.vn"]);

export const DEFAULT_AUTH_NOTICE =
  "BeeWise đang chuẩn bị ra mắt. Bạn hãy theo dõi fanpage BeeWise để nhận thông báo sớm nhất nhé. Cảm ơn bạn đã quan tâm BeeWise!";

export function isPublicAuthPaused(
  host: string | null,
  flag: string | undefined,
) {
  const hostname = host?.trim().toLowerCase().replace(/:\d+$/, "");
  return flag === "true" && !!hostname && PUBLIC_HOSTS.has(hostname);
}

export function getPublicAuthStatus(host: string | null) {
  return {
    paused: isPublicAuthPaused(host, process.env.BEEWISE_AUTH_PAUSED),
    notice: process.env.BEEWISE_AUTH_NOTICE_TEXT?.trim() || DEFAULT_AUTH_NOTICE,
  };
}
