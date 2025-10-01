"use client";

import AuthGuard from "@/components/AuthGuard";
import DriveItems from "@/components/DriveItems";
import { useDriveStore } from "@/store/useDriveStore";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function FolderDetail() {
  // Get Id From Params
  const { id } = useParams();

  // Call useDriveStore
  const { folderFilesLoading, folderFiles, fetchFolderFiles } = useDriveStore();

  // Get User Info
  const { user, isLoaded } = useUser();

  // Setup Data
  useEffect(() => {
    if (user) {
      fetchFolderFiles(String(id));
    }
  }, [user, isLoaded]);

  // Check Auth
  if (!user && isLoaded) return <AuthGuard />;

  // Check Loader
  if (folderFilesLoading) {
    return (
      <div className="flex items-center justify-center pt-3">
        <Loader2 className="animate-spin" color="white" size={34} />
      </div>
    );
  }

  // If Emty Files And Folders Modal
  if (
    !folderFilesLoading &&
    folderFiles.length === 0 &&
    folderFiles.length === 0
  ) {
    return (
      <div className="flex items-center justify-center pt-3">
        <p className="text-steel text-lg font-semibold">
          📂 No files or folders found
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Show Files In Folders */}
      <div
        className={`grid grid-cols-1 xl:grid-cols-3 gap-5 ${
          folderFiles.length > 0 && "mb-10"
        }`}
      >
        {folderFiles.length > 0 &&
          folderFiles.map((item, idx) => (
            <DriveItems item={item} key={item.id || idx} />
          ))}
      </div>
    </div>
  );
}

export default FolderDetail;
