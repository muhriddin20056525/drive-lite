"use client";

import AuthGuard from "@/components/AuthGuard";
import DriveItems from "@/components/DriveItems";
import { useDriveStore } from "@/store/useDriveStore";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function StarredPage() {
  const {
    fetchStarredAndTrashedData,
    starredFiles,
    starredFolders,
    starredAndTrashedLoading,
  } = useDriveStore();

  // Get User Info
  const { user, isLoaded } = useUser();

  // Setup Data
  useEffect(() => {
    if (user) {
      fetchStarredAndTrashedData("starred");
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
    starredFolders.length === 0 &&
    starredFiles.length === 0
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
          starredFolders.length > 0 && "mb-10"
        }`}
      >
        {starredFolders.length > 0 &&
          starredFolders.map((item) => (
            <DriveItems
              item={item}
              key={item.id ?? `starred-${Math.random()}`}
            />
          ))}
      </div>

      {/* Show Files */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {starredFiles.length > 0 &&
          starredFiles.map((item) => (
            <DriveItems
              item={item}
              key={item.id ?? `starred-${Math.random()}`}
            />
          ))}
      </div>
    </div>
  );
}

export default StarredPage;
