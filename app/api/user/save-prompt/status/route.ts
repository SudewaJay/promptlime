import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ isSaved: false });
    }

    const { searchParams } = new URL(req.url);
    const promptId = searchParams.get("promptId");
    if (!promptId) {
      return NextResponse.json({ error: "Prompt ID required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ isSaved: false });
    }

    const isSaved = user.savedPrompts.some((id: { toString: () => string }) => id.toString() === promptId);
    return NextResponse.json({ isSaved });
  } catch {
    return NextResponse.json({ isSaved: false });
  }
}
