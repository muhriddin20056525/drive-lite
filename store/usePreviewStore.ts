import { IFile } from "@/types";
import { create } from "zustand";

type PreviewState = {
  isOpen: boolean;
  file: IFile | null;
  openPreview: (file: IFile) => void;
  closePreview: () => void;
};

export const usePreviewStore = create<PreviewState>((set) => ({
  isOpen: false,
  file: null,

  openPreview: (file) => set({ isOpen: true, file }),
  closePreview: () => set({ isOpen: false, file: null }),
}));
