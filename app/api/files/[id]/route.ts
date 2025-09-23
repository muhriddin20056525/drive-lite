import { prisma } from "@/lib/prisma";
import { IFile } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Single File
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
    // Find File By ID
    const folder = await prisma.file.findFirst({
      where: { ownerId: userId, id: params.id },
    });

    // Return Response
    return NextResponse.json(
      { message: "Get File Successfully!", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILE_GET_SINGLE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Edit File
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, isStarred, isTrashed } = await req.json();

  // Get User Id from auth
  const { userId } = await auth();

  // Check User
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Build New Object For Update File
  const updateData: Partial<IFile> = {};

  // Check req.json Data
  if (name !== undefined) updateData.name = name;
  if (isStarred !== undefined) updateData.isStarred = isStarred;
  if (isTrashed !== undefined) updateData.isTrashed = isTrashed;

  try {
    // Find File With ID
    const file = await prisma.file.findUnique({ where: { id: params.id } });

    // Check File
    if (!file) {
      return NextResponse.json({ error: "File Not Found" }, { status: 404 });
    }

    // If change Filename
    if (name !== undefined && name !== file.name) {
      const existingFile = await prisma.file.findFirst({
        where: {
          ownerId: userId,
          name,
          NOT: { id: params.id },
        },
      });

      if (existingFile) {
        return NextResponse.json(
          { error: "File with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update File
    const updatedFile = await prisma.file.update({
      where: { id: params.id, ownerId: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: "File Upadated Successfully!",
      file: updatedFile,
    });
  } catch (error) {
    console.error("[FILES_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete File
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

    // File Delete
    const deletedFile = await prisma.file.delete({
      where: { ownerId: userId, id: params.id },
    });

    return NextResponse.json(
      { message: "Delete File Successfully!", file: deletedFile },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
