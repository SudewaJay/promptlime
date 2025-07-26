// app/api/users/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return NextResponse.json({ users });
}