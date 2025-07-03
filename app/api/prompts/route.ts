// app/api/prompts/route.ts
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET: Fetch all prompts
export async function GET() {
  try {
    await connectToDatabase(); // ✅ Connect Mongoose
    const prompts = await Prompt.find({}).sort({ createdAt: -1 });
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
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // ✅ Connect Mongoose
    const body = await req.json();

    const prompt = await Prompt.create({
      title: body.title,
      category: body.category,
      prompt: body.prompt,
      image: body.image || "",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, prompt }, { status: 201 });
  } catch (err: any) {
    console.error("❌ POST /api/prompts error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}