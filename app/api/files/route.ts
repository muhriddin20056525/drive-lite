import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Upload File
export async function POST(req: NextRequest) {
  // Get Data From Frontend
  const { name, type, url, size } = await req.json();

  // Get UserId Form Clerk
  const { userId } = await auth();

  // Check UserId
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Check All Fileds

  if (!name || !type || !url || !size) {
    return NextResponse.json(
      { message: "All fields (name, type, url, size) are required" },
      { status: 400 }
    );
  }

  try {
    // Upload File
    const newFile = await prisma.file.create({
      data: {
        name,
        userId,
        type,
        url,
        size,
      },
    });

    // Return Response To Frontend
    return NextResponse.json({
      message: "New File Uploaded",
      file: newFile,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Upload File", error },
      { status: 500 }
    );
  }
}

// Get All Files
export async function GET(req: NextRequest) {
  // Get User Id From Clerk
  const { userId } = await auth();

  // Check User Id
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get All Files This User
    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return Response To Frontend
    return NextResponse.json({ message: "Get All Files", files });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error Fetch All Files", error },
      { status: 500 }
    );
  }
}
