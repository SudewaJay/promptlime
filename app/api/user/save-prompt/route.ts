import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { promptId } = await req.json();
    if (!promptId) {
      return NextResponse.json({ error: "Prompt ID is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pId = new mongoose.Types.ObjectId(promptId);
    const isSaved = user.savedPrompts.some((id: mongoose.Types.ObjectId) => id.toString() === promptId);

    if (isSaved) {
      // Remove from saved
      user.savedPrompts = user.savedPrompts.filter((id: mongoose.Types.ObjectId) => id.toString() !== promptId);
    } else {
      // Add to saved
      user.savedPrompts.push(pId);
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      isSaved: !isSaved,
      savedCount: user.savedPrompts.length 
    });
  } catch (error) {
    console.error("Save prompt error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
