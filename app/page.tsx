"use client";

import FolderCard from "@/components/FolderCard";
import { IFolder } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function Home() {
  // State For Saving Folder Data
  const [folders, setFolders] = useState<IFolder[]>([]);

  // Get All Folders From API
  const handleGetFolders = async () => {
    try {
      const { data } = await axios.get("/api/folder");
      setFolders(data.folders);
    } catch (error) {
      console.log("Get All Folders Error: ", error);
    }
  };

  useEffect(() => {
    handleGetFolders();
  }, []);

  return (
    <div className="p-5">
      {!folders.length && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-dark/50">
          <Loader2 className="h-10 w-10 animate-spin text-skyflare" />
        </div>
      )}

      <div className="flex flex-wrap gap-5">
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
