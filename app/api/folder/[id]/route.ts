import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Delete Single Folder
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get Folder Id From Params
  const { id } = await params;

  try {
    // Delete Folder
    const deleteFolder = await prisma.folder.delete({
      where: { id: Number(id) },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "Folder Deleted",
      folder: deleteFolder,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Delete Folder", error },
      { status: 500 }
    );
  }
}

// Edit Single Folder
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get Folder Id From Params
  const { id } = await params;

  // Get Folder Data From Frontend
  const { name } = await req.json();

  try {
    // Update Folder
    const updateFolder = await prisma.folder.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "Folder Updated Successfully",
      folder: updateFolder,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Edit Folder", error },
      { status: 500 }
    );
  }
}
