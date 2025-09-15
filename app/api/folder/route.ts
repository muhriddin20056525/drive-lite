import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Create Folder
export async function POST(req: NextRequest) {
  // Get Name From Frontend
  const { name, folderId } = await req.json();

  // Get UserId Form Clerk
  const { userId } = await auth();

  // Check UserId
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Duplicate Check
  const existingFolder = await prisma.folder.findFirst({
    where: { userId, name },
  });

  if (existingFolder) {
    return NextResponse.json(
      { message: "Folder with this name already exists" },
      { status: 400 }
    );
  }

  try {
    // Create Folder
    const newFolder = await prisma.folder.create({
      data: {
        name,
        userId,
        type: "folder",
      },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "Created New Folder",
      folder: newFolder,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Create Folder", error },
      { status: 500 }
    );
  }
}

// Get All Folders
export async function GET(req: NextRequest) {
  // Get User Id From Clerk
  const { userId } = await auth();

  // Check User Id
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get All Folders This User
    const folders = await prisma.folder.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return Response To Frontend
    return NextResponse.json({ message: "Get All Folders", folders });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Fetch All Folders", error },
      { status: 500 }
    );
  }
}
