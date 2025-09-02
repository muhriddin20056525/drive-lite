import React from "react";

function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gradient-dark fixed top-16 border-r border-graphite p-5">
      <ul className="flex flex-col gap-4">
        <li className="text-skyfog font-normal text-[14px] py-2.5 px-3 rounded-[10px] hover:bg-storm border border-transparent hover:border-graphite hover:shadow-elevated bg-gradient-hover">
          Home
        </li>
        <li className="text-skyfog font-normal text-[14px] py-2.5 px-3 rounded-[10px] hover:bg-storm border border-transparent hover:border-graphite hover:shadow-elevated bg-gradient-hover">
          About
        </li>
        <li className="text-skyfog font-normal text-[14px] py-2.5 px-3 rounded-[10px] hover:bg-storm border border-transparent hover:border-graphite hover:shadow-elevated bg-gradient-hover">
          Blog
        </li>
        <li className="text-skyfog font-normal text-[14px] py-2.5 px-3 rounded-[10px] hover:bg-storm border border-transparent hover:border-graphite hover:shadow-elevated bg-gradient-hover">
          Contact
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
