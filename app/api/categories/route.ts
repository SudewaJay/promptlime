// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name } = await req.json();
  const newCategory = await Category.create({ name });
  return NextResponse.json({ category: newCategory }, { status: 201 });
}