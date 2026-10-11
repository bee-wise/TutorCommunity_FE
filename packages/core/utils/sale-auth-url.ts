export function getSaleAuthUrl(path: "/register"): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SALE_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://beewise.vn");
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
