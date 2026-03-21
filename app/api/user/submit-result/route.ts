import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Result from "@/models/Result";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { promptId, beforeImage, afterImage, caption } = await req.json();

    if (!promptId || !beforeImage || !afterImage) {
      return NextResponse.json(
        { error: "Prompt ID, Before Image, and After Image are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newResult = await Result.create({
      userId: session.user.id,
      promptId,
      beforeImage,
      afterImage,
      caption,
    });

    return NextResponse.json({ success: true, result: newResult });
  } catch (error) {
    console.error("Submit result error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
