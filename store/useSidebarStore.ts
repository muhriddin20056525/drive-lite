import { create } from "zustand";

type SidebarStateType = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export const useSidebar = create<SidebarStateType>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
