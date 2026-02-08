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
    // Using simple request body parsing
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    // Handle Like Action
    if (action === "incrementLike" || action === "decrementLike") {
      const update =
        action === "incrementLike"
          ? { $inc: { likes: 1 } }
          : { $inc: { likes: -1 } };

      const updatedPrompt = await Prompt.findByIdAndUpdate(id, update, { new: true });
      return NextResponse.json({ success: true, prompt: updatedPrompt }, { status: 200 });
    }

    // Handle Copy Action
    if (action !== "incrementCopyCount") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const session: Session | null = await getServerSession(authOptions);
    const cookieStore = await cookies();

    let allowCopy = true;
    let setCookie = false;
    let errorMessage = "";
    let currentGuestCount = 0;

    // 1. Guest Logic (Cookie based)
    if (!session?.user) {
      const copyCountCookie = cookieStore.get("guest_copy_count");
      currentGuestCount = copyCountCookie ? parseInt(copyCountCookie.value, 10) : 0;

      if (currentGuestCount >= 2) {
        allowCopy = false;
        errorMessage = "Guest limit reached (2/2). Please login for more.";
      } else {
        currentGuestCount += 1;
        setCookie = true;
        // Construct a way to pass this back (NextJS middleware/response style)
        // We will set the cookie on the response object later
      }
    }
    // 2. Logged-in User Logic (DB based)
    else if (session.user.email) {
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check Pro Status
      if (user.isPro) {
        // Pro users have UNLIMITED copies
        allowCopy = true;
      } else {
        // Free Users: 20/month limit
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Reset if needed
        if (!user.lastReset || new Date(user.lastReset) < startOfMonth) {
          user.copyCount = 0;
          user.lastReset = now;
        }

        if (user.copyCount >= 20) {
          allowCopy = false;
          errorMessage = "Free limit reached (20/20). Upgrade to Pro for unlimited.";
        } else {
          user.copyCount = (user.copyCount || 0) + 1;
          // Ensure lastReset is set
          if (!user.lastReset) user.lastReset = now;
          await user.save();
        }
      }
    }

    if (!allowCopy) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 }
      );
    }

    // Increment global prompt copy count
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    const response = NextResponse.json({ success: true, prompt: updatedPrompt }, { status: 200 });

    // Set cookie if guest
    if (setCookie) {
      // We can't use `response.cookies` directly in older Next/Edge sometimes, but in App Router this works
      response.cookies.set("guest_copy_count", currentGuestCount.toString(), {
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

// ==========================
// DELETE /api/prompts/:id
// ==========================
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Optional: Check if user is admin/owner here if not handled by middleware
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Prompt deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}