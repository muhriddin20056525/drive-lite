const mimeToExt: Record<string, string> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/msword": "doc",
  "application/pdf": "pdf",
  "text/plain": "txt",

  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",

  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
};

export function getFileExtension(mimeType: string): string {
  return mimeToExt[mimeType] || mimeType.split("/")[1] || "file";
}
