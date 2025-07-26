import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const updated = await User.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}