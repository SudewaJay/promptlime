import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import User from "@/models/User";
import { getServerSession } from "next-auth/next"; // correct import for App Router
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";
import type { Session } from "next-auth";  // import Session type
import type { User as NextAuthUser } from "next-auth"; // import NextAuth User type

// Define update body shape
interface PromptUpdateBody {
  title?: string;
  category?: string;
  prompt?: string;
  image?: string;
  likes?: number;
  copyCount?: number;
  views?: number;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const prompt = await Prompt.findById(params.id);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ data: prompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body: PromptUpdateBody = await req.json();

    const updatedPrompt = await Prompt.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedPrompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    // Explicitly type session with NextAuth Session or null
    const session: Session | null = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const { action } = await req.json();

    if (action !== "incrementCopyCount") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    let allowCopy = true;
    const response = NextResponse.next();

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

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
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
          {
            error: "Monthly limit reached. Upgrade to Pro for unlimited access.",
          },
          { status: 403 }
        );
      }

      user.copyCount += 1;
      await user.save();
    }

    if (!allowCopy) {
      return NextResponse.json(
        {
          error: "Guests can only copy one prompt. Please login to continue.",
        },
        { status: 403 }
      );
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      params.id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    return NextResponse.json({ success: true, prompt: updatedPrompt }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PATCH /prompts/:id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}