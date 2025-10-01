"use client";

import { sidebarLinks } from "@/constants";
import { useDriveStore } from "@/store/useDriveStore";
import { useSidebar } from "@/store/useSidebarStore";
import { formatFileSize } from "@/utils/formatSize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Sidebar() {
  const pathName = usePathname();

  const { isOpen } = useSidebar();

  const { totalSize, calculateSize } = useDriveStore();

  useEffect(() => {
    calculateSize();
  }, []);

  return (
    <aside
      className={`w-64 h-[calc(100vh-64px)] bg-gradient-dark fixed top-16 border-r border-graphite p-5 flex flex-col transition-all duration-300 ${
        !isOpen && "-translate-x-full"
      } md:translate-x-0 z-50`}
    >
      {/* Sidebar Links */}
      <ul className="flex flex-col gap-4 grow">
        {sidebarLinks.map((item) => (
          <li key={item.label}>
            <Link
              href={item.path}
              className={`text-skyfog font-normal text-[14px] py-2.5 px-3 rounded-[10px] 
    flex items-center gap-3
    hover:bg-[linear-gradient(180deg,var(--color-storm),var(--color-abyss))]
    hover:border-graphite hover:shadow-elevated
    ${
      item.path === pathName
        ? "border border-graphite shadow-elevated bg-[linear-gradient(180deg,var(--color-storm),var(--color-abyss))]"
        : "border border-transparent hover:bg-storm"
    } 
  `}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Storage Button */}
      <button className="border border-graphite bg-abyss text-white py-2.5 w-full font-semibold rounded-[12px] bg-gradient-dark">
        Your Used {formatFileSize(totalSize)}
      </button>
    </aside>
  );
}

export default Sidebar;
