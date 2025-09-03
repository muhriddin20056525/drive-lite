"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
