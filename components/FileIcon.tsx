// components/FileIcon.tsx
import { FileImage, FileVideo, FileText } from "lucide-react";

type FileIconProps = {
  type: string;
  className?: string;
};

export default function FileIcon({ type, className }: FileIconProps) {
  // Return Image Icon
  if (type.startsWith("image/")) {
    return (
      <FileImage className={className} color="white" width={30} height={30} />
    );
  }

  // Return Video Icon
  if (type.startsWith("video/")) {
    return (
      <FileVideo className={className} color="white" width={30} height={30} />
    );
  }

  // Return File Icon
  return (
    <FileText className={className} color="white" width={30} height={30} />
  );
}
