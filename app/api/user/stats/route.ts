import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

// Optional: If you have a likes model
import Like from "@/models/Like"; // ➕ (create this if you haven't)

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ➕ Count liked prompts
    const likedCount = await Like.countDocuments({ userEmail: session.user.email });

    // 🟢 Copied prompt count
    const copiedCount = user.copyCount || 0;

    // 📁 Saved categories (assuming savedCategories is an array on the user)
    const savedCount = user.savedCategories?.length || 0;

    return NextResponse.json({
      likedCount,
      copiedCount,
      savedCount,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}