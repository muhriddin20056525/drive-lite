import { IFile, IFolder } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface DriveState {
  folders: IFolder[];
  files: IFile[];

  starredFolders: IFolder[];
  starredFiles: IFile[];

  trashedFolders: IFolder[];
  trashedFiles: IFile[];

  recentData: IFolder[] | IFile[];

  folderFiles: IFile[];
  folderFilesLoading: boolean;

  loading: boolean;
  starredAndTrashedLoading: boolean;
  recentDataLoading: boolean;

  totalSize: number;

  fetchData: () => Promise<void>;
  fetchStarredAndTrashedData: (status: "trash" | "starred") => Promise<void>;
  fetchFolderFiles: (id: string) => Promise<void>;
  fetchRecentData: () => Promise<void>;
  updateData: (
    id: string,
    type: "folder" | "file",
    updates: Partial<IFile> | Partial<IFolder>
  ) => Promise<void>;
  deleteData: (id: string, type: "folder" | "file") => Promise<void>;
  markAsAccessed: (id: string, type: "file" | "folder") => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  createFile: (
    name: string,
    size: number,
    ul: string,
    type: string,
    folderId?: string | null
  ) => Promise<void>;

  calculateSize: () => Promise<void>;
  fetchSearchData: (q: string) => Promise<void>;
}

export const useDriveStore = create<DriveState>((set, get) => ({
  folders: [],
  files: [],

  starredFolders: [],
  starredFiles: [],

  trashedFolders: [],
  trashedFiles: [],

  recentData: [],

  folderFiles: [],
  folderFilesLoading: true,

  loading: true,
  starredAndTrashedLoading: true,
  recentDataLoading: true,
  totalSize: 0,

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

  // Fetch Starred And Trashed File And Folders
  fetchStarredAndTrashedData: async (status: "trash" | "starred") => {
    try {
      // Fetch Starred And Trashed Data
      const [folders, files] = await Promise.all([
        axios.get(`/api/folders?filter=${status}`),
        axios.get(`/api/files?filter=${status}`),
      ]);

      // Data Set To srarredFolders And starredFiles State
      if (status === "starred") {
        set({
          starredFolders: folders.data.folders,
          starredFiles: files.data.files,
        });
      } else {
        set({
          trashedFolders: folders.data.folders,
          trashedFiles: files.data.files,
        });
      }
    } catch (error) {
      console.error("[FETCH_STARRED_AND_TRASHED_DATA_ERROR]", error);

      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to load data");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      set({ starredAndTrashedLoading: false });
    }
  },

  // Fetch Files IN Folder
  fetchFolderFiles: async (id: string) => {
    try {
      // Fetch Files From Api
      const { data } = await axios.get(`/api/folders/${id}`);

      // Set Data To State
      set({ folderFiles: data.folder.files });
    } catch (error) {
      console.error("[FETCH_FILES_IN_FOLDER_DATA_ERROR]", error);

      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to load data");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      set({ folderFilesLoading: false });
    }
  },

  // Fetch Recent Data
  fetchRecentData: async () => {
    try {
      // Fetch Recent Folder and Files
      const [folders, files] = await Promise.all([
        axios.get("/api/folders?filter=recent"),
        axios.get("/api/files?filter=recent"),
      ]);

      // Merge and sort by lastAccessedAt
      const merged = [...folders.data.folders, ...files.data.files].sort(
        (a, b) =>
          new Date(b.lastAccessedAt).getTime() -
          new Date(a.lastAccessedAt).getTime()
      );

      // Set to state
      set({ recentData: merged });
    } catch (error) {
      console.error("[FETCH_RECENT_DATA_ERROR]", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Failed to load recent data"
        );
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      set({ recentDataLoading: false });
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

      // Serverdan qaytgan yangilangan item — backend shu formatni qaytarsa ideal
      const serverItem = (data as any)?.item ?? (data as any)?.[type] ?? null;

      set((state) => {
        const key = type === "file" ? "files" : "folders";
        const trashKey = type === "file" ? "trashedFiles" : "trashedFolders";
        const starredKey = type === "file" ? "starredFiles" : "starredFolders";

        const active = state[key];
        const trash = state[trashKey];
        const starred = state[starredKey];
        const folderFiles = state.folderFiles;

        // Topishga harakat qilamiz (agar mavjud bo'lsa)
        const foundActive = active.find((it) => it.id === id);
        const foundTrash = trash.find((it) => it.id === id);

        // Agar server item bo'lsa uni olamiz, bo'lmasa mavjud state item yoki fallback obyekt yaratamiz
        const updatedItem =
          serverItem ??
          foundActive ??
          foundTrash ??
          ({ id, ...(updates as any) } as any);

        // Helper: arraydan undefined yoki id yo'q narsalarni tozalash
        const sanitize = (arr: any[]) =>
          arr
            .filter(Boolean)
            .filter((it) => it && it.id !== undefined && it.id !== null);

        // Boshlang'ich nusxalar
        let updatedActive = [...active];
        let updatedTrash = [...trash];
        let updatedStarred = [...starred];
        let updatedFolderFiles = [...folderFiles];

        // === TRASH ===
        if (updates.hasOwnProperty("isTrashed")) {
          if ((updates as any).isTrashed) {
            // Move to trash: olib tashlash va trashga qo'shish (duplicate yo'q)
            updatedActive = updatedActive.filter((it) => it.id !== id);
            updatedTrash = [
              ...updatedTrash.filter((t) => t.id !== id),
              updatedItem,
            ];

            // Agar file bo'lsa folderFiles'dan ham o'chiramiz
            if (type === "file") {
              updatedFolderFiles = updatedFolderFiles.filter(
                (f) => f.id !== id
              );
            }

            // Trashga tushganda starreddan ham olib tashlaymiz
            updatedStarred = updatedStarred.filter((it) => it.id !== id);
          } else {
            // Restore: trashdan chiqarib activega qo'shamiz (duplicate yo'q)
            updatedTrash = updatedTrash.filter((it) => it.id !== id);
            updatedActive = [
              ...updatedActive.filter((it) => it.id !== id),
              updatedItem,
            ];

            if (type === "file") {
              // agar folderFiles-ga qaytarilishi kerak bo'lsa
              updatedFolderFiles = [
                ...updatedFolderFiles.filter((f) => f.id !== id),
                updatedItem,
              ];
            }

            // Agar updateda isStarred true bo'lsa, starredga ham qo'shish
            if ((updates as any).isStarred) {
              updatedStarred = [
                ...updatedStarred.filter((s) => s.id !== id),
                updatedItem,
              ];
            }
          }
        }

        // === STARRED ===
        else if (updates.hasOwnProperty("isStarred")) {
          if ((updates as any).isStarred) {
            updatedStarred = [
              ...updatedStarred.filter((s) => s.id !== id),
              updatedItem,
            ];
          } else {
            updatedStarred = updatedStarred.filter((s) => s.id !== id);
          }

          // active va folderFiles ni ham yangilaymiz
          updatedActive = updatedActive.map((it) =>
            it.id === id ? updatedItem : it
          );
          if (type === "file") {
            updatedFolderFiles = updatedFolderFiles.map((f) =>
              f.id === id ? updatedItem : f
            );
          }
        }

        // === SIMPLE UPDATE (name, boshqa fields) ===
        else {
          updatedActive = updatedActive.map((it) =>
            it.id === id ? updatedItem : it
          );
          updatedStarred = updatedStarred.map((it) =>
            it.id === id ? updatedItem : it
          );
          if (type === "file") {
            updatedFolderFiles = updatedFolderFiles.map((f) =>
              f.id === id ? updatedItem : f
            );
          }
        }

        return {
          [key]: sanitize(updatedActive),
          [trashKey]: sanitize(updatedTrash),
          [starredKey]: sanitize(updatedStarred),
          folderFiles: sanitize(updatedFolderFiles),
        };
      });

      toast.success((data as any).message || "Updated");
    } catch (error) {
      console.error("[PATCH_DATA_ERROR]", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response as any)?.data?.error || "Failed to load data"
        );
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },

  // Delete Folder And File
  deleteData: async (id: string, type: "folder" | "file") => {
    try {
      // Request For Delete File
      const { data } = await axios.delete(`/api/${type}s/${id}`);

      // Update Star And Trash Data
      await get().fetchStarredAndTrashedData("trash");

      // Update File Size
      await get().calculateSize();

      toast.success(data.message);
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

  markAsAccessed: async (id: string, type: "file" | "folder") => {
    try {
      // Request For Changeing lastAccessedAt
      const { data } = await axios.put(
        `/api/${type === "file" ? "/files" : "folders"}/${id}/access`
      );
    } catch (error) {
      console.error("[MARK_AS_ACCESSED_ERROR]", error);
    }
  },

  createFolder: async (name: string) => {
    try {
      // Request Create Folder
      const { data } = await axios.post("/api/folders", { name });

      // Update Local State
      set((state) => ({
        folders: [data.folder, ...state.folders],
      }));

      // Show Notification
      toast.success("Folder created successfully!");
    } catch (error) {
      console.error("[CREATE_FOLDER_ERROR]", error);
      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to delete data");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },

  createFile: async (
    name: string,
    size: number,
    url: string,
    type: string,
    folderId?: string | null
  ) => {
    try {
      // Request For Create File
      const { data } = await axios.post("/api/files", {
        name,
        url,
        size,
        type,
        folderId,
      });

      // Update Local State
      set((state) => ({
        files: [...state.files, data.file],
        folderFiles: folderId
          ? [data.file, ...state.folderFiles]
          : state.folderFiles,
      }));
      // Update Size
      await get().calculateSize();
      // Show Notification
      toast.success("File created successfully");
    } catch (error) {
      console.error("[CREATE_FILE_ERROR]", error);
      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to delete data");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },

  calculateSize: async () => {
    try {
      const { data } = await axios.get("/api/storage");

      set({ totalSize: data.totalSize });
    } catch (error) {
      console.error("[CALCULATE_FILE_SIZE_ERROR]", error);
      // Showing Errors
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to calculate size");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  },

  fetchSearchData: async (q: string) => {
    try {
      const { data } = await axios.get(`/api/search?q=${q}`);
      set({ folders: data.folders || [], files: data.files || [] });
    } catch (error) {
      console.error("[SEARCH_FETCH_ERROR]", error);
    }
  },
}));
