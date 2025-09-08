"use client";

import { IFolder } from "@/types";
import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";

type FolderContextType = {
  folders: IFolder[];
  isFetching: boolean;
  isCreating: boolean;
  getFolders: () => void;
  createFolder: (name: string) => Promise<void>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
};

export const FolderContext = createContext<FolderContextType | null>(null);

function FolderProvider({ children }: { children: ReactNode }) {
  // State Save For Folder Data
  const [folders, setFolders] = useState<IFolder[]>([]);
  // State For Get All Folders Loading
  const [isFetching, setIsFetching] = useState<boolean>(true);
  // State For Create Folder Loading
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Get All Folders
  const getFolders = async () => {
    try {
      // Send Request To Backend
      const { data } = await axios.get("/api/folder");
      setFolders(data.folders);
    } catch (error) {
      console.log("Get All Folders Error: ", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Create Folder
  const createFolder = async (name: string) => {
    try {
      setIsCreating(true);
      // Send Request To Backend
      const { data } = await axios.post("/api/folder", { name });
      // Show Notification
      toast.success(data.message || "Folder Created Successfully");

      // Update Local State For Take Date On Real Time
      setFolders((prev) => [...prev, data.folder]);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const updateFolder = async (id: string, name: string) => {
    try {
      // Send Request To Backend
      const { data } = await axios.put(`/api/folder/${id}`, { name });

      // Show Notification
      toast.success(data.message || "Folder Updated Successfully");

      // Update Local State For Take Date On Real Time
      setFolders((prev) =>
        prev.map((f) => (f.id === id ? { ...f, name: data.folder.name } : f))
      );
    } catch (error: any) {
      console.log("Edit Folder Error: ", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      // Send Request To Backend
      const { data } = await axios.delete(`/api/folder/${id}`);

      // Update Local State For Take Date On Real Time
      setFolders((prev) => prev.filter((f) => f.id !== id));

      // Show Notification
      toast.success(data.message || "Folder Deleted Successfully");
    } catch (error: any) {
      console.log("Delete Folder Error: ", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  };

  return (
    <FolderContext.Provider
      value={{
        isFetching,
        isCreating,
        folders,
        getFolders,
        createFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export default FolderProvider;
