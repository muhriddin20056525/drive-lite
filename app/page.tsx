"use client";

import FolderCard from "@/components/FolderCard";
import { useFolders } from "@/hooks/useFolders";
import { FolderOpen, Loader2 } from "lucide-react";
import { useEffect } from "react";

function Home() {
  // Get Loading, Folders and GetFolders Function From Context
  const { isFetching, folders, getFolders } = useFolders();

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div>
      {isFetching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-dark/50">
          <Loader2 className="h-10 w-10 animate-spin text-skyflare" />
        </div>
      )}

      {/* IF Emty Folders State */}
      {!isFetching && folders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="h-14 w-14 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-300">No Data Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            Try creating a new folder to get started.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1  md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5">
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
