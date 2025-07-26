// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const category = await Category.findById(params.id);
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { name } = await req.json();
  const updated = await Category.findByIdAndUpdate(params.id, { name }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" }, { status: 204 });
}