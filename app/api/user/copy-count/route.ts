
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ count: 0, error: "User not found" }, { status: 404 });
    }

    // Return the copyCount from the User model
    return NextResponse.json({
      copyCount: user.copyCount || 0,
      isPro: user.isPro || false
    }, { status: 200 });

  } catch (err) {
    console.error("❌ Error getting copy count:", err);
    return NextResponse.json({ count: 0, error: "Server error" }, { status: 500 });
  }
}