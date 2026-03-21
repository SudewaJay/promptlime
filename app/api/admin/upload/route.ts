import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop() || "jpg";
    const fileKey = `prompts/${uuidv4()}.${extension}`;

    await uploadToR2(fileKey, buffer, file.type);

    return NextResponse.json({ success: true, fileKey });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Upload error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
