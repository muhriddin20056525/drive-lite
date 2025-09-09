import { FileContext } from "@/context/FileContext";
import { useContext } from "react";

export const useFiles = () => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFiles must be used within FileProvider");
  return ctx;
};
