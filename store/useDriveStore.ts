import { IFile, IFolder } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface DriveState {
  folders: IFolder[];
  files: IFile[];
  loading: boolean;
  fetchData: () => Promise<void>;
  updateData: (
    id: string,
    type: "folder" | "file",
    updates: Partial<IFile> | Partial<IFolder>
  ) => Promise<void>;
  deleteData: (id: string, type: "folder" | "file") => Promise<void>;
}

export const useDriveStore = create<DriveState>((set, get) => ({
  folders: [],
  files: [],
  loading: true,

  // Get All Folders And Files
  fetchData: async () => {
    try {
      // Fetch Files And Folders
      const [folders, files] = await Promise.all([
        axios.get("/api/folders"),
        axios.get("/api/files"),
      ]);

      // Set Fetching Data To States
      set({
        folders: folders.data.folders,
        files: files.data.files,
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

  // Updated Data
  updateData: async (
    id: string,
    type: "folder" | "file",
    updates: Partial<IFile> | Partial<IFolder>
  ) => {
    try {
      const { data } = await axios.patch(
        `/api/${type === "file" ? "files" : "folders"}/${id}`,
        updates
      );

      // Call Fetch Data For Update Data
      await get().fetchData();

      toast.success(
        data.message ||
          `${type === "file" ? "file" : "folder"} updated successfully!`
      );
    } catch (error) {
      console.error("[PATCH_DATA_ERROR]", error);

      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to load data");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },

  // Delete Folder And File
  deleteData: async (id: string, type: "folder" | "file") => {
    try {
      // Check Type
      if (type === "folder") {
        // Delete Folder
        const { data } = await axios.delete(`/api/folders/${id}`);
        // Show Notification
        toast.success(data.message || "Delete Folder Successfully!");

        // Delete Folder Data From State
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
        }));
      } else if (type === "file") {
        // Delete File
        const { data } = await axios.delete(`/api/files/${id}`);

        // Show Notification
        toast.success(data.message || "Delete File Successfully!");

        // Delete File Data From State
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
        }));
      }
    } catch (error) {
      console.error("[DELETE_DATA_ERROR]", error);

      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to delete data");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },
}));
