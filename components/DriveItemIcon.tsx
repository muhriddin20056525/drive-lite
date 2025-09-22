import { File, FileImage, FileVideo, FolderClosed } from "lucide-react";

function DriveItemIcon({ type }: { type: string }) {
  return (
    <div className="w-10 h-10 bg-card-icon rounded-sm flex items-center justify-center">
      {type === "folder" && <FolderClosed color="white" />}
      {type === "file" && <File color="white" />}
      {type === "image" && <FileImage color="white" />}
      {type === "video" && <FileVideo color="white" />}
    </div>
  );
}

export default DriveItemIcon;
