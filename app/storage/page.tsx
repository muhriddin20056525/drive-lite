"use client";

import AuthGuard from "@/components/AuthGuard";
import { useDriveStore } from "@/store/useDriveStore";
import { formatFileSize } from "@/utils/formatSize";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

function Storage() {
  const { user, isLoaded } = useUser();

  const { totalSize, calculateSize } = useDriveStore();

  // Check Auth
  if (!user && isLoaded) return <AuthGuard />;

  useEffect(() => {
    calculateSize();
  }, []);

  // Check Max Size
  const maxStorage = 0.5 * 1024 * 1024 * 1024;

  // Progress Bar
  const percent = Math.min((totalSize / maxStorage) * 100, 100);

  return (
    <div className="bg-midnight text-skyfog">
      <div className="w-full p-4">
        <h1 className="text-xl font-semibold mb-4">Storage</h1>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-graphite rounded-full overflow-hidden">
          <div
            className="h-full bg-skyflare transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* Info */}
        <p className="text-sm text-steel mt-2">
          {formatFileSize(totalSize)} of {formatFileSize(maxStorage)} used
        </p>
      </div>
    </div>
  );
}

export default Storage;
