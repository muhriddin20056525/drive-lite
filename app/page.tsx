"use client";

import FileCard from "@/components/FileCard";
import FolderCard from "@/components/FolderCard";
import { useFiles } from "@/hooks/useFiles";
import { useFolders } from "@/hooks/useFolders";
import { SignInButton, useUser } from "@clerk/nextjs";
import { FolderOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

function Home() {
  const { isFetching, folders, getFolders } = useFolders();
  const { files, getFiles } = useFiles();

  // Clerk
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (user) {
      getFolders();
      getFiles();
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-dark/50">
        <Loader2 className="h-10 w-10 animate-spin text-skyflare" />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <>
          {isFetching ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-dark/50">
              <Loader2 className="h-10 w-10 animate-spin text-skyflare" />
            </div>
          ) : (
            <>
              {folders.length === 0 && files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <FolderOpen className="h-14 w-14 text-gray-400 mb-4" />
                  <h2 className="text-lg font-semibold text-gray-300">
                    No Data Found
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Try creating a new folder to get started.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Folders */}
                  <div>
                    <h2 className="text-skyfog text-2xl mb-4 font-bold">
                      Folders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5 mb-5">
                      {folders.map((folder) => (
                        <FolderCard folder={folder} key={folder.id} />
                      ))}
                    </div>
                  </div>

                  {/* Files */}
                  <div>
                    <h2 className="text-skyfog text-2xl mb-4 font-bold">
                      Files
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5">
                      {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-dark px-4">
          {/* Rasm */}
          <div className="w-52 h-52 mb-6 relative">
            <Image
              src="/login-illustration.png"
              alt="Login Illustration"
              fill
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-skyfog text-2xl font-bold mb-2">
            Login is required
          </h1>
          <p className="text-steel text-sm mb-6 text-center max-w-sm">
            You must be logged in to use this Site.
          </p>

          {/* Clerk Button */}
          <SignInButton mode="modal">
            <button className="border border-graphite bg-transparent text-white py-2.5 px-6.5 font-semibold rounded-[12px] cursor-pointer hover:bg-abyss">
              Login
            </button>
          </SignInButton>
        </div>
      )}
    </>
  );
}

export default Home;
