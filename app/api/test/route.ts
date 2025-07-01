import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ success: true, message: "Connected to MongoDB" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: false, error: "An unknown error occurred." });
  }
}