// utils/shortenFileName.ts
export function shortenFileName(name: string, maxLength = 20): string {
  if (name.length <= maxLength) return name;

  // Get Extname
  const ext = name.split(".").pop();
  const base = name.substring(0, maxLength - (ext?.length ?? 0) - 3);

  return `${base}...${ext}`;
}
