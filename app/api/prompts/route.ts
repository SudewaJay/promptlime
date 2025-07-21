// app/api/prompts/route.ts
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllPrompts, createPrompt } from "@/lib/promptService";

// GET: Fetch all prompts
export async function GET() {
  try {
    await connectToDatabase(); // ✅ Connect Mongoose
    const prompts: unknown = await getAllPrompts();
    return NextResponse.json(prompts, { status: 200 });
  } catch (err: any) {
    console.error("❌ GET /api/prompts error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

// POST: Add a new prompt
export async function POST(req: Request) {
  try {
    await connectToDatabase(); // ✅ Connect Mongoose
    const body = await req.json();

    const newPrompt: unknown = await createPrompt(body);

    return NextResponse.json({ success: true, prompt: newPrompt }, { status: 201 });
  } catch (err: any) {
    console.error("❌ POST /api/prompts error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}