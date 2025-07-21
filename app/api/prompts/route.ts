import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getAllPrompts, createPrompt } from "@/lib/promptService";

// GET: Fetch all prompts
export async function GET() {
  try {
    await connectToDatabase();
    const prompts = await getAllPrompts();
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