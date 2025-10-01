"use client";

import AuthGuard from "@/components/AuthGuard";
import DriveItems from "@/components/DriveItems";
import { useDriveStore } from "@/store/useDriveStore";
import { IFile, IFolder } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function RecentPage() {
  const { user, isLoaded } = useUser();

  const { recentData, fetchRecentData, recentDataLoading } = useDriveStore();

  useEffect(() => {
    fetchRecentData();
  }, []);

  console.log(recentData);

  // Check Auth
  if (!user && isLoaded) return <AuthGuard />;

  // Check Loader
  if (recentDataLoading) {
    return (
      <div className="flex items-center justify-center pt-3">
        <Loader2 className="animate-spin" color="white" size={34} />
      </div>
    );
  }

  // If Emty Files And Folders Data
  if (
    !recentDataLoading &&
    recentData.length === 0 &&
    recentData.length === 0
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
      {/* Show Files */}
      <div className="grid gap-5">
        {recentData.length > 0 &&
          recentData.map((item: IFolder | IFile) => (
            <DriveItems status="recent" item={item} key={item.id} />
          ))}
      </div>
    </div>
  );
}

export default RecentPage;
