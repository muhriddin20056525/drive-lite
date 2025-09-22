export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + " B"; // If less than 1mb
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB"; // To 1Mb
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"; // To 1GB
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"; // More Than 1GB
  }
}
