// helpers/cookie.ts
export function getCookieValue(key: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
