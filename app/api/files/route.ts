import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get File List
export async function GET(req: Request) {
  try {
    // Get User Id
    const { userId } = await auth();

    // Check User ID
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get Qury From SearchParams
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    // General Variables
    let files;
    let message = "Get All Files";

    // Get Starred files
    if (filter === "starred") {
      files = await prisma.file.findMany({
        where: { ownerId: userId, isStarred: true, isTrashed: false },
        orderBy: { updatedAt: "desc" },
      });

      message = "Get All Starred Files";
    } else if (filter === "trash") {
      // Get Trash files
      files = await prisma.file.findMany({
        where: { ownerId: userId, isTrashed: true },
        orderBy: { updatedAt: "desc" },
      });

      message = "Get All Trashed Files";
    } else if (filter === "recent") {
      // Get Recent files
      files = await prisma.file.findMany({
        where: { ownerId: userId, isStarred: false },
        orderBy: { lastAccessedAt: "desc" },
        take: 10,
      });
    } else {
      // Get All files
      files = await prisma.file.findMany({
        where: { ownerId: userId, isTrashed: false, folderId: null },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ message, files }, { status: 200 });
  } catch (error) {
    console.error("[FILES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create File
export async function POST(req: Request) {
  try {
    // Get User Id
    const { userId } = await auth();

    // Check User ID
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get Folder Name From Frontend
    const { name, url, type, size, folderId } = await req.json();

    // Check Folder Name
    if (!name.trim() || !url.trim() || !type.trim() || !size) {
      return NextResponse.json(
        { error: "All Fields Required" },
        { status: 400 }
      );
    }

    // Check Duplicate Folder
    const existing = await prisma.file.findFirst({
      where: { ownerId: userId, name, isTrashed: false },
    });

    // Return Already Existing Error
    if (existing) {
      return NextResponse.json(
        { error: "File with this name already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create File
    const file = await prisma.file.create({
      data: {
        ownerId: userId,
        name,
        url,
        type,
        size,
        folderId,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Create File Successfully", file },
      { status: 201 }
    );
  } catch (error) {
    console.error("[FILE_CREATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
