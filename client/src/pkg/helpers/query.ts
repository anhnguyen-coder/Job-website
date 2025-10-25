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

export function buildQueryParams(query: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
