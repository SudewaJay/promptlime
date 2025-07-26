// app/api/users/[id]/toggle-pro/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const user = await User.findById(params.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.isPro = !user.isPro;
  await user.save();

  return NextResponse.json({ success: true, isPro: user.isPro });
}