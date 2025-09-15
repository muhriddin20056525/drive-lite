import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Delete Single File
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get File Id From Params
  const { id } = await params;

  try {
    // Delete File
    const deleteFile = await prisma.file.delete({
      where: { id: Number(id) },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "File Deleted",
      file: deleteFile,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Delete Folder", error },
      { status: 500 }
    );
  }
}

// Edit Single File
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get File Id From Params
  const { id } = await params;

  // Get File Data From Frontend
  const { name } = await req.json();

  // Get UserId Form Clerk
  const { userId } = await auth();

  // Check UserId
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Duplicate Check
  const existingFile = await prisma.file.findFirst({
    where: { userId, name },
  });

  if (existingFile) {
    return NextResponse.json(
      { message: "File with this name already exists" },
      { status: 400 }
    );
  }

  try {
    // Update File
    const updateFile = await prisma.file.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "File Updated Successfully",
      file: updateFile,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Edit Folder", error },
      { status: 500 }
    );
  }
}
