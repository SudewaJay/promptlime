import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/authOptions";
import type { Session } from "next-auth";

interface PromptUpdateBody {
  title?: string;
  category?: string;
  prompt?: string;
  image?: string;
  likes?: number;
  copyCount?: number;
  views?: number;
}

// ==========================
// GET /api/prompts/:id
// ==========================
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Get ID from URL
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ data: prompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ==========================
// PUT /api/prompts/:id
// ==========================
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body: PromptUpdateBody = await req.json();

    const updatedPrompt = await Prompt.findByIdAndUpdate(id, body, { new: true });

    if (!updatedPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedPrompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ==========================
// PATCH /api/prompts/:id
// ==========================
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const session: Session | null = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const { action } = await req.json();

    if (action !== "incrementCopyCount") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    let allowCopy = true;
    const response = NextResponse.next();

    // Guest copy limit via cookie
    if (!session?.user) {
      const copiedOnce = cookieStore.get("copied_once");
      if (copiedOnce?.value === "true") {
        allowCopy = false;
      } else {
        response.cookies.set("copied_once", "true", {
          maxAge: 86400,
          path: "/",
          sameSite: "lax",
        });
      }
    }

    // Logged-in user limit
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (!user.lastReset || user.lastReset < startOfMonth) {
        user.copyCount = 0;
        user.lastReset = now;
        await user.save();
      }

      if (!user.isPro && user.copyCount >= 5) {
        return NextResponse.json(
          { error: "Monthly limit reached. Upgrade to Pro for unlimited access." },
          { status: 403 }
        );
      }

      user.copyCount += 1;
      await user.save();
    }

    if (!allowCopy) {
      return NextResponse.json(
        { error: "Guests can only copy one prompt. Please login to continue." },
        { status: 403 }
      );
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    return NextResponse.json({ success: true, prompt: updatedPrompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PATCH /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}