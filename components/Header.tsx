import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="h-16 w-full fixed top-0 left-0 bg-gradient-dark border border-graphite shadow-elevated z-50 px-5 flex items-center justify-between gap-5">
      {/* Logo */}
      <Link
        href={"/"}
        className="text-skyfog flex items-center gap-2.5 font-bold"
      >
        <span className="w-2.5 h-2.5 bg-skyflare rounded-full logo-dot"></span>
        Drive
      </Link>

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
        <div className="flex items-center gap-2.5 fixed bottom-3 right-3 md:static">
          <button className="border border-graphite bg-abyss text-white py-2.5 px-3.5 font-semibold rounded-[12px] cursor-pointer">
            New Folder
          </button>

          <button className="bg-skyflare text-white border-none py-2.5 px-3.5 font-semibold rounded-[12px] cursor-pointer">
            New Folder
          </button>
        </div>

        <SignedOut>
          <SignInButton>
            <button className="border border-graphite bg-transparent text-white py-2.5 px-3.5 font-semibold rounded-[12px] cursor-pointer">
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
