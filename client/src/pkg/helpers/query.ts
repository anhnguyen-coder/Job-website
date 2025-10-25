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
