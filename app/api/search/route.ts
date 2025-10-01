import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get User ID
    const { userId } = await auth();

    // Check Userid
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Get Query Params
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // Check Query
    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 }
      );
    }

    // Get Folder And Files Data And Search
    const [folders, files] = await Promise.all([
      prisma.folder.findMany({
        where: {
          ownerId: userId,
          isTrashed: false,
          name: { contains: query, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.file.findMany({
        where: {
          ownerId: userId,
          isTrashed: false,
          name: { contains: query, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ folders, files }, { status: 200 });
  } catch (error) {
    console.error("[SEARCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
