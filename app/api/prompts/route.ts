import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getAllPrompts, createPrompt } from "@/lib/promptService";

// GET: Fetch all prompts with filtering and sorting
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const tool = searchParams.get("tool");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort"); // 'trending' or 'date' (default)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (tool && tool !== "All") query.tool = tool;
    if (category) query.category = category;
    if (tag) query.tags = tag;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOption: any = { createdAt: -1 }; // Default: Newest first
    if (sort === "trending") {
      sortOption = { views: -1, likes: -1, copyCount: -1 };
    }

    const prompts = await getAllPrompts(query, sortOption);

    return NextResponse.json(prompts, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ GET /api/prompts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

// POST: Add a new prompt
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newPrompt = await createPrompt(body);

    return NextResponse.json({ success: true, prompt: newPrompt }, { status: 201 });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ POST /api/prompts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}