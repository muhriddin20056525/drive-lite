import { prisma } from "@/lib/prisma";
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

  // Get File Data From Forntend
  const { name, url, type, size, folderId, isStarred, isTrashed } =
    await req.json();

  // Check File Data
  if (
    !name.trim() ||
    !url.trim() ||
    !type.trim() ||
    !size ||
    isStarred == undefined ||
    isTrashed == undefined
  ) {
    return NextResponse.json({ error: "All Fields Required" }, { status: 400 });
  }

  try {
    // Check Duplicate File
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

    // Update File
    const updatedFile = await prisma.file.update({
      where: { ownerId: userId, id: params.id },
      data: { name, url, type, size, folderId, isStarred, isTrashed },
    });

    // Return Response
    return NextResponse.json(
      { message: "Update File Successfully!", file: updatedFile },
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
