import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    await connectToDatabase();
    
    const prompts = await Prompt.find({ slug: { $exists: false } });
    let updatedCount = 0;

    for (const prompt of prompts) {
      const baseSlug = slugify(prompt.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness
      while (await Prompt.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      prompt.slug = slug;
      await prompt.save();
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Backfilled slugs for ${updatedCount} out of ${prompts.length} prompts.`,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Slug backfill error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
