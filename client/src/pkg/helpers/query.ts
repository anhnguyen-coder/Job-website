import type { PagyInput } from "../types/interfaces/pagy";

export function parseQueryArrayToString(values: string[]): string {
  const cleaned = values.map((v) => v.trim().toLowerCase()).filter(Boolean);

  if (!cleaned.length) {
    return "";
  }

  if (cleaned.length === 1) {
    return cleaned[0].toString();
  }

  return cleaned.map(encodeURIComponent).join(",").toString();
}

export function buildQueryParams<T extends object>(
  query: T,
  pagyInput: PagyInput
): string {
  const params = new URLSearchParams();

  (Object.entries(query) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(String(key), String(value));
    }
  });

  params.append("page", String(pagyInput.page ?? 1));
  params.append("limit", String(pagyInput.limit ?? 10));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
