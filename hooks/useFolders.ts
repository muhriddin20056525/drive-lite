import { FolderContext } from "@/context/FolderContext";
import { useContext } from "react";

export const useFolders = () => {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("useFolders must be used within FolderProvider");
  return ctx;
};
