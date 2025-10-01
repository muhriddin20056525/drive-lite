import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    // Get User ID
    const { userId } = await auth();

    // Check User
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get All Files Of This User
    const files = await prisma.file.findMany({
      where: { ownerId: userId },
      select: { size: true },
    });

    // Calculate Size
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

    return NextResponse.json({ totalSize }, { status: 200 });
  } catch (error) {
    console.error("[STORAGE_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
