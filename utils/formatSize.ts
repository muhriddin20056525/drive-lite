export function formatSizeByType(bytes: number, type: string): string {
  if (type.startsWith("video")) {
    // Showing MB Videos
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    // Showing KB Other Files
    return (bytes / 1024).toFixed(2) + " KB";
  }
}
