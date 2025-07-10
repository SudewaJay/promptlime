import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const { action } = await req.json();

    // Only handle copy count
    if (action !== "incrementCopyCount") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const headers = new Headers();
    let allowCopy = true;

    // 🌐 GUEST USER — 1 copy per day via cookie
    if (!session?.user) {
      const copiedOnce = cookieStore.get("copied_once");

      if (copiedOnce?.value === "true") {
        allowCopy = false;
      } else {
        headers.append(
          "Set-Cookie",
          `copied_once=true; Path=/; Max-Age=86400; SameSite=Lax`
        );
      }
    }

    // 👤 LOGGED-IN USER — 5 copies/month (unless Pro)
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Reset monthly if outdated
      if (!user.lastReset || user.lastReset < startOfMonth) {
        user.copyCount = 0;
        user.lastReset = now;
        await user.save();
      }

      // Not a Pro user — check limit
      if (!user.isPro && user.copyCount >= 5) {
        return NextResponse.json(
          {
            error:
              "Monthly limit reached. Upgrade to Pro for unlimited access.",
          },
          { status: 403 }
        );
      }

      // ✅ Allow copy and increment
      user.copyCount += 1;
      await user.save();
    }

    if (!allowCopy) {
      return NextResponse.json(
        {
          error:
            "Guests can only copy one prompt. Please login to continue.",
        },
        { status: 403 }
      );
    }

    // ✅ Increment prompt's copy count
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      params.id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ success: true, prompt: updatedPrompt }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("❌ Error in PATCH /prompts/:id:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}