import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Folder List
export async function GET(req: Request) {
  try {
    // Get User Id
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get Qury From SearchParams
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    // General Variables
    let folders;
    let message = "Get All Folders";

    // Get Starred Folder
    if (filter === "starred") {
      folders = await prisma.folder.findMany({
        where: { ownerId: userId, isStarred: true, isTrashed: false },
        orderBy: { updatedAt: "desc" },
        include: { files: true },
      });

      message = "Get All Starred Folders";
    } else if (filter === "trash") {
      // Get Trash Folders
      folders = await prisma.folder.findMany({
        where: { ownerId: userId, isTrashed: true },
        orderBy: { updatedAt: "desc" },
        include: { files: true },
      });

      message = "Get All Trashed Folders";
    } else if (filter === "recent") {
      // Get Recent Folders
      folders = await prisma.folder.findMany({
        where: { ownerId: userId, isStarred: false },
        orderBy: { lastAccessedAt: "desc" },
        take: 10,
        include: { files: true },
      });
    } else {
      // Get All Folders
      folders = await prisma.folder.findMany({
        where: { ownerId: userId, isTrashed: false },
        include: { files: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ message, folders }, { status: 200 });
  } catch (error) {
    console.error("[FOLDERS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create Folder
export async function POST(req: Request) {
  try {
    // Get User Id
    const { userId } = await auth();

    // Check User ID
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get Folder Name From Frontend
    const { name } = await req.json();
    const trimmedName = String(name ?? "").trim();

    // Check Folder Name
    if (!trimmedName) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    // Check Duplicate Folder
    const existing = await prisma.folder.findFirst({
      where: {
        ownerId: userId,
        name: trimmedName,
        isTrashed: false,
      },
    });

    // Return Already Existing Error
    if (existing) {
      return NextResponse.json(
        { error: "Folder with this name already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create Folder
    const folder = await prisma.folder.create({
      data: { name: trimmedName, ownerId: userId, lastAccessedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Create Folder Successfully", folder },
      { status: 201 }
    );
  } catch (error) {
    console.error("[FOLDER_CREATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
