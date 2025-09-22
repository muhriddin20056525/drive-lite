"use client";

import { SignedOut } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";

export default function AuthGuard() {
  return (
    <div className="h-[calc(100vh-104px)] flex items-center justify-center bg-gradient-to-br from-midnight via-abyss to-storm text-skyfog px-4">
      <div className="max-w-md w-full bg-abyss border border-graphite rounded-2xl shadow-elevated p-10 text-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4 text-skyfog tracking-tight">
          DriveLite
        </h1>

        {/* Description */}
        <p className="text-steel mb-8 leading-relaxed">
          Your personal cloud. Store files, organize folders, and access
          everything securely — anytime, anywhere.
        </p>

        {/* Login Button */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="border border-graphite bg-transparent text-white py-2.5 px-6.5 font-semibold rounded-md cursor-pointer hover:bg-abyss">
              Login
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
