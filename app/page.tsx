"use client";

import AuthGuard from "@/components/AuthGuard";
import DriveItems from "@/components/DriveItems";
import { useDriveStore } from "@/store/useDriveStore";
import { IFolder } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

function Home() {
  // Get Folder And Files Data
  const { folders, files, loading, fetchData } = useDriveStore();

  // Get User Info
  const { user, isLoaded } = useUser();

  // Setup Data
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, isLoaded]);

  return (
    <div>
      {/* Check Auth */}
      {!user && isLoaded && <AuthGuard />}

      {/* Show Folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {folders.length > 0 &&
          folders.map((item) => <DriveItems item={item} key={item.id} />)}
      </div>

      {/* Show Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {files.length > 0 &&
          files.map((item) => <DriveItems item={item} key={item.id} />)}
      </div>
    </div>
  );
}

export default Home;
