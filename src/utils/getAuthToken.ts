import { parseCookies } from "nookies";

export function getAuthToken(ctx?: any): string | undefined {
  const cookies = parseCookies(ctx);
  return cookies["nextauth.token"];
}
