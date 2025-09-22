import { IFile, IFolder } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface DriveState {
  folders: IFolder[];
  files: IFile[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

export const useDriveStore = create<DriveState>((set) => ({
  folders: [],
  files: [],
  loading: false,

  fetchData: async () => {
    try {
      // Change Loading
      set({ loading: true });

      // Fetch Files And Folders
      const [folders, files] = await Promise.all([
        axios.get("/api/folders"),
        axios.get("/api/files"),
      ]);

      // Set Fetching Data To States
      set({
        folders: folders.data.folders,
        files: files.data.files,
        loading: false,
      });
    } catch (error) {
      console.error("[FETCH_DATA_ERROR]", error);

      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to load data");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      set({ loading: false });
    }
  },
}));
