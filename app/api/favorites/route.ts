import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get All Favorites Data
export async function GET(req: NextRequest) {
  try {
    const favorites = await prisma.favorites.findMany({});
    return NextResponse.json({ favorites, message: "Get All Favorites Data" });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Get All Favorites Data", error },
      { status: 500 }
    );
  }
}
