"use client";

import { IFile } from "@/types";
import { supabase } from "@/utils/supabase";
import axios from "axios";
import React, { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";

type FileContextType = {
  files: IFile[];
  isUploading: boolean;
  getFiles: () => void;
  uploadFile: (
    name: string,
    type: string,
    url: string,
    size: number
  ) => Promise<boolean>;
  updateFile: (id: string, name: string) => Promise<boolean>;
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
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
      return false;
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
      return false;
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
      setFiles((prev) => [data.file, ...prev]);
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
      return false;
    }
  };

  // Update Files
  const updateFile = async (id: string, name: string) => {
    if (!name) {
      toast.error("Name is required");
      return false;
    }

    try {
      const { data } = await axios.put(`/api/files/${id}`, {
        name,
      });

      console.log(data);

      // Show Notification
      toast.success(data.message || "File Updated Successfully");

      setFiles((prev) => prev.map((f) => (f.id === id ? data.file : f)));
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
      return false;
    }
    return false;
  };

  // Delete File
  const deleteFile = async (id: string) => {
    try {
      const { data } = await axios.delete(`/api/files/${id}`);
      // Update Local State For Take Date On Real Time
      setFiles((prev) => prev.filter((f) => f.id !== id));

      // Delete File From Supabase
      const { data: supabseData, error } = await supabase.storage
        .from("drive-lite")
        .remove([data.file.url]);

      // Show Delete File Error
      if (error) {
        console.log("Supabse File Delete Error: ", error);
      }

      // Show Notification
      toast.success(data.message || "File Deleted Successfully");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
      return false;
    }
  };

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
