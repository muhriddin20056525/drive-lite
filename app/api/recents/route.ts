import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Recent File And Folders
export async function GET(req: Request) {
  // Get User Id From Clerk
  const { userId } = await auth();

  // Check User ID
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Get Recent Folders
    const recentFolders = await prisma.folder.findMany({
      where: { ownerId: userId, isTrashed: false },
      orderBy: { lastAccessedAt: "desc" },
      take: 10,
      include: { files: true },
    });

    // Get Recent Files
    const recentFiles = await prisma.file.findMany({
      where: { ownerId: userId, isTrashed: false },
      orderBy: { lastAccessedAt: "desc" },
      take: 10,
    });

    return NextResponse.json(
      { message: "Recent Items", folders: recentFolders, files: recentFiles },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RECENT_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
