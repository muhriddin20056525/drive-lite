import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Get User ID From Clerk
  const { userId } = await auth();

  // Check User ID
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Edit Folder Date
    const folder = await prisma.folder.update({
      where: { ownerId: userId, id: params.id },
      data: { lastAccessedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Folder access updated", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FOLDER_ACCESS_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
