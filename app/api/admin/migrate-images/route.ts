import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { uploadToR2 } from "@/lib/r2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const debug = searchParams.get("debug") === "true";

    await connectToDatabase();
    
    // Check total count to see if we're even connected correctly
    const totalCount = await Prompt.countDocuments();
    
    // 1. Fetch all prompts where the image is still a Pinterest URL (starts with http)
    const prompts = await Prompt.find({
      image: { $regex: /^http/ }
    });

    const results = {
      message: "Migration Status",
      database_total: totalCount,
      to_migrate: prompts.length,
      success: 0,
      failed: 0,
      errors: [] as string[],
      samples: debug ? prompts.slice(0, 3).map(p => ({ id: p._id, title: p.title, image: p.image })) : [],
    };

    for (const prompt of prompts) {
      try {
        console.log(`📸 Migrating prompt: ${prompt._id} (${prompt.title})`);
        
        // 2. Download the image
        const response = await fetch(prompt.image);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 3. Upload to R2 (prompts/[id].jpg)
        const fileKey = `prompts/${prompt._id}.jpg`;
        await uploadToR2(fileKey, buffer, "image/jpeg");
        
        // 4. Update Database field to the R2 path (NOT a full URL, but the key)
        prompt.image = fileKey;
        await prompt.save();
        
        results.success++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`❌ Migration failed for ${prompt._id}:`, errorMessage);
        results.failed++;
        results.errors.push(`${prompt._id}: ${errorMessage}`);
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
