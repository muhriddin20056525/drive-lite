import { prisma } from "@/lib/prisma";
import { IFolder } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Files In Folder
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
      include: {
        files: { where: { isTrashed: false }, orderBy: { createdAt: "desc" } },
      },
    });

    // Return Response
    return NextResponse.json(
      { message: "Get Folder Successfully!", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FOLDER_GET_SINGLE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Edit Folder
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  let { name, isStarred, isTrashed } = await req.json();

  // Get User Id from auth
  const { userId } = await auth();

  // Check User
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Trim Name
  if (typeof name === "string") {
    name = name.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Folder name cannot be empty" },
        { status: 400 }
      );
    }
  }

  // Build New Object For Update Folder
  const updateData: Partial<IFolder> = {};

  // Check req.json Data
  if (name !== undefined) updateData.name = name;
  if (isStarred !== undefined) updateData.isStarred = isStarred;
  if (isTrashed !== undefined) updateData.isTrashed = isTrashed;

  try {
    // Find File With ID
    const folder = await prisma.folder.findUnique({ where: { id: params.id } });

    // Check folder
    if (!folder) {
      return NextResponse.json({ error: "Folder Not Found" }, { status: 404 });
    }

    // If change foldername
    if (name !== undefined && name !== folder.name) {
      const existingfolder = await prisma.folder.findFirst({
        where: {
          ownerId: userId,
          name,
          NOT: { id: params.id },
        },
      });

      if (existingfolder) {
        return NextResponse.json(
          { error: "Folder with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update folder
    const updatedFolder = await prisma.folder.update({
      where: { id: params.id, ownerId: userId },
      data: updateData,
    });

    // Dynamic message
    let message = "Folder updated successfully!";
    if (isTrashed !== undefined) {
      message = isTrashed
        ? "Folder moved to trash!"
        : "Folder restored from trash!";
    } else if (isStarred !== undefined) {
      message = isStarred ? "Folder starred!" : "Folder unstarred!";
    } else if (name !== undefined && name !== folder.name) {
      message = "Foldername updated successfully!";
    }

    return NextResponse.json({
      message,
      folder: updatedFolder,
    });
  } catch (error) {
    console.error("[FOLDERS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete Folder
export async function DELETE(
  _req: Request,
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
    console.error("[FOLDER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
