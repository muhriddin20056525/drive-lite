import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Faqat development muhitida ishlashini tekshirish
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = await getToken({ template: "auth-token" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("JWT olishda xato:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
