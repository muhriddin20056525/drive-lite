"use client";

import { IFile } from "@/types";
import axios from "axios";
import React, { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";

type FileContextType = {
  files: IFile[];
  isUploading: boolean;
  getFiles: () => void;
  uploadFile: (name: string, type: string, url: string, size: number) => void;
  updateFile: (name: string) => void;
  deleteFile: (id: string) => void;
};

export const FileContext = createContext<FileContextType | null>(null);

function FileProvider({ children }: { children: ReactNode }) {
  // State For All Files
  const [files, setFiles] = useState<IFile[]>([]);
  //  State For Loading Upload File
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Fetch All Files
  const getFiles = async () => {
    try {
      const { data } = await axios.get("/api/files");
      setFiles(data.files);
    } catch (error) {
      console.log("Fetch ALL File Error", error);
    }
  };

  // Upload File
  const uploadFile = async (
    name: string,
    type: string,
    url: string,
    size: number
  ) => {
    if (!name || !type || !url || !size) {
      toast.error("All fields (name, type, url, size) are required");
      return;
    }

    try {
      // Send Request To Backend
      const { data } = await axios.post("/api/files", {
        name,
        type,
        url,
        size,
      });

      // Show Notification
      toast.success(data.message || "New File Uploaded");

      // Update Local State For Take Data On Real Time
      setFiles((prev) => [...prev, data.file]);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  };

  const updateFile = async (name: string) => {};

  const deleteFile = async (id: string) => {};

  return (
    <FileContext.Provider
      value={{
        files,
        isUploading,
        getFiles,
        uploadFile,
        updateFile,
        deleteFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export default FileProvider;
