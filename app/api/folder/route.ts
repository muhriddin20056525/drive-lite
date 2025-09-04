import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Create Folder
export async function POST(req: NextRequest) {
  // Get Name From Frontend
  const { name } = await req.json();

  // Get UserId Form Clerk
  const { userId } = await auth();

  // Check UserId
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create Folder
    const newFolder = await prisma.folder.create({
      data: {
        name,
        userId,
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
  try {
    // Get All Folders
    const folders = await prisma.folder.findMany({});

    // Return Response To Frontend
    return NextResponse.json({ message: "Get All Folders", folders });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Fetch All Folders", error },
      { status: 500 }
    );
  }
}
