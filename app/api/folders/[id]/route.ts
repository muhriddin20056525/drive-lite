import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Single Folder
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Get User Id
  const { userId } = await auth();

  // Check User Id
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Find Folder By ID
    const folder = await prisma.folder.findFirst({
      where: { ownerId: userId, id: params.id },
      include: { files: true },
    });

    // Return Response
    return NextResponse.json(
      { message: "Get Folder Successfully!", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILES_GET_SINGLE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Edit Folder
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Get User Id
  const { userId } = await auth();

  // Check User Id
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Get Folder Data From Forntend
  const { name, isStarred, isTrashed } = await req.json();

  // Check Folder Data
  if (!name.trim() || isStarred == undefined || isTrashed == undefined) {
    return NextResponse.json({ error: "All Fields Required" }, { status: 400 });
  }

  try {
    // Check Duplicate Folder
    const existing = await prisma.folder.findFirst({
      where: { ownerId: userId, name, isTrashed: false },
    });

    // Return Already Existing Error
    if (existing) {
      return NextResponse.json(
        { error: "Folder with this name already exists" },
        { status: 409 } // Conflict
      );
    }

    // Update Folder
    const updatedFolder = await prisma.folder.update({
      where: { ownerId: userId, id: params.id },
      data: { name, isStarred, isTrashed },
    });

    // Return Response
    return NextResponse.json(
      { message: "Update Folder Successfully!", folder: updatedFolder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILES_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete Folder
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get User Id
    const { userId } = await auth();

    // Check User Id
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Folder Delete
    const deletedFolder = await prisma.folder.delete({
      where: { ownerId: userId, id: params.id },
    });

    return NextResponse.json(
      { message: "Delete Folder Successfully!", folder: deletedFolder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILES_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
