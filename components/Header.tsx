"use client";

import { useSidebar } from "@/store/useSidebarStore";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { MenuIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Header() {
  // State For Toggle Create Folder Modal
  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);
  // State For Toggle File Upload Modal
  const [openFileUploadModal, setOpenFileUploadModal] =
    useState<boolean>(false);

  // Pathname for Showing Modal Buttons
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isFolderDetail = pathname.startsWith("/folders/");

  // For Toggle Responsive Sidebar
  const { toggleSidebar } = useSidebar();

  // Get User From Clerk
  const { user } = useUser();

  return (
    <header className="h-16 w-full fixed top-0 left-0 bg-gradient-dark border border-graphite shadow-elevated z-50 px-5 flex items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <div
          className="w-8 h-8 rounded-xs bg-slate-800 flex justify-center items-center shadow-elevated cursor-pointer md:hidden"
          onClick={toggleSidebar}
        >
          <MenuIcon color="white" size={20} />
        </div>
        {/* Logo */}
        <Link
          href={"/"}
          className="text-skyfog flex items-center gap-2.5 font-bold"
        >
          <span className="w-2.5 h-2.5 bg-skyflare rounded-full logo-dot"></span>
          Drive
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center border border-graphite grow rounded-2xl gap-2.5 bg-storm py-2.5 px-3">
        <Search color="white" width={16} height={16} />

        <input
          type="text"
          placeholder="Search folder or file"
          className="grow outline-none bg-transparent text-skyfog"
        />

        <div className="border border-graphite text-xs text-steel py-1 px-1.5 rounded-[8px]">
          Ctrl /
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {user && isHome && (
          <div className="flex items-center gap-2.5 fixed bottom-3 right-3 md:static">
            <button className="border border-graphite bg-abyss text-white py-2.5 px-3.5 font-semibold rounded-md cursor-pointer">
              New Folder
            </button>

            <button className="bg-azure-light text-white border-none py-2.5 px-3.5 font-semibold rounded-md cursor-pointer">
              File Upload
            </button>
          </div>
        )}

        {isFolderDetail && (
          <button className="bg-azure-light text-white border-none py-2.5 px-3.5 font-semibold rounded-md cursor-pointer">
            File Upload
          </button>
        )}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="border border-graphite bg-transparent text-white py-2.5 px-6.5 font-semibold rounded-md cursor-pointer hover:bg-abyss">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

export default Header;
