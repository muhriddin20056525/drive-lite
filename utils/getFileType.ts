export function formatFileType(mimeType: string, fileName: string): string {
  if (!mimeType && !fileName) return "file/unknown";

  const [main] = mimeType.split("/") || [];
  let ext = fileName.split(".").pop()?.toLowerCase() || "unknown";

  if (main === "image") return `image/${ext}`;
  if (main === "video") return `video/${ext}`;
  if (main === "audio") return `audio/${ext}`;

  // qolgan barcha narsani umumiy file sifatida qaytarish
  return `file/${ext}`;
}
