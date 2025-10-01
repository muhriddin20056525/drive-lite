"use client";

import AuthGuard from "@/components/AuthGuard";
import DriveItems from "@/components/DriveItems";
import { useDriveStore } from "@/store/useDriveStore";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function TrashPage() {
  const {
    fetchStarredAndTrashedData,
    trashedFiles,
    trashedFolders,
    starredAndTrashedLoading,
  } = useDriveStore();

  // Get User Info
  const { user, isLoaded } = useUser();

  // Setup Data
  useEffect(() => {
    if (user) {
      fetchStarredAndTrashedData("trash");
    }
  }, [user, isLoaded]);

  // Check Auth
  if (!user && isLoaded) return <AuthGuard />;

  // Check Loader
  if (starredAndTrashedLoading) {
    return (
      <div className="flex items-center justify-center pt-3">
        <Loader2 className="animate-spin" color="white" size={34} />
      </div>
    );
  }

  // If Emty Files And Folders Data
  if (
    !starredAndTrashedLoading &&
    trashedFolders.length === 0 &&
    trashedFiles.length === 0
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
      {/* Show Folders */}
      <div
        className={`grid grid-cols-1 xl:grid-cols-3 gap-5 ${
          trashedFolders.length > 0 && "mb-10"
        }`}
      >
        {trashedFolders.length > 0 &&
          trashedFolders.map((item) => (
            <DriveItems status="trashed" item={item} key={item.id} />
          ))}
      </div>

      {/* Show Files */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {trashedFiles.length > 0 &&
          trashedFiles.map((item) => (
            <DriveItems status="trashed" item={item} key={item.id} />
          ))}
      </div>
    </div>
  );
}

export default TrashPage;
