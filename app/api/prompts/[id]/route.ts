import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
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

    // 👉 Handle copy count logic
    if (action === "incrementCopyCount") {
      let allowCopy = true;
      const headers = new Headers();

      // 🧑 Guest user (not logged in)
      if (!session?.user) {
        const copiedOnce = cookieStore.get("copied_once");

        if (copiedOnce?.value === "true") {
          allowCopy = false;
        } else {
          // ✅ Set cookie via response header (must return response manually)
          headers.append("Set-Cookie", `copied_once=true; Path=/; Max-Age=86400; SameSite=Lax`);
        }
      }

      // 👤 Logged-in user (basic rate limit of 5/day stored in DB)
      if (session?.user) {
        // TODO: ideally, store daily copy counts per user in DB
        // For now, skip DB logic and allow all copies
        // Extend this in your User model later
      }

      if (!allowCopy) {
        return NextResponse.json(
          { error: "Only one prompt allowed for guests. Please login." },
          { status: 403 }
        );
      }

      // ✅ Update Prompt copy count
      const updated = await Prompt.findByIdAndUpdate(
        params.id,
        { $inc: { copyCount: 1 } },
        { new: true }
      );

      return new NextResponse(JSON.stringify({ success: true, prompt: updated }), {
        status: 200,
        headers,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error in PATCH handler:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}