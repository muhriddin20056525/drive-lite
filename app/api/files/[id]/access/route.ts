import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // Get User ID From Clerk
  const { userId } = await auth();

  // Check User ID
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Edit File Date
    const file = await prisma.file.update({
      where: { ownerId: userId, id: params.id },
      data: { lastAccessedAt: new Date() },
    });

    return NextResponse.json(
      { message: "File access updated", file },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FILE_ACCESS_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
