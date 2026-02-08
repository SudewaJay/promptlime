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
    let setCookie = false;

    // Guest copy limit via cookie (ALLOW 2 COPIES)
    if (!session?.user) {
      const copyCountCookie = cookieStore.get("guest_copy_count");
      let currentCount = copyCountCookie ? parseInt(copyCountCookie.value, 10) : 0;

      if (currentCount >= 2) {
        allowCopy = false;
      } else {
        currentCount += 1;
        setCookie = true;

        // Define cookie options for reuse
        const cookieOptions = {
          maxAge: 86400 * 30, // 30 days
          path: "/",
          sameSite: "lax" as const,
        };

        // We need to set the cookie on the response
        // We'll store the count in a variable to set it later
        (req as unknown as { _guestCopyCount: number })._guestCopyCount = currentCount;
      }
    }

    // Logged-in user limit - UNLIMITED
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Track usage statistics (optional reset logic preserved)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (!user.lastReset || user.lastReset < startOfMonth) {
        user.copyCount = 0;
        user.lastReset = now;
      }

      // UNLIMITED: No check against a limit
      user.copyCount += 1;
      await user.save();
    }

    if (!allowCopy) {
      return NextResponse.json(
        { error: "Guests can only copy two prompts. Please login for unlimited access." },
        { status: 403 }
      );
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    const response = NextResponse.json({ success: true, prompt: updatedPrompt }, { status: 200 });

    // Set cookie on the ACTUAL response object we are returning
    if (setCookie) {
      const count = (req as unknown as { _guestCopyCount: number })._guestCopyCount;
      response.cookies.set("guest_copy_count", count.toString(), {
        maxAge: 86400 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("❌ Error in PATCH /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}