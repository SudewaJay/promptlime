import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { NextResponse } from "next/server";

const STYLES = ["cinematic", "anime", "ghibli", "pixar", "watercolor", "oil-painting", "cyberpunk", "vintage", "fantasy", "minimal", "3d"];
const USE_CASES = ["self-portrait", "product", "landscape", "group", "pet", "food", "portrait"];
const MOODS = ["dark", "vibrant", "warm", "dreamy", "retro", "minimal"];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Safety check - require an admin secret or run locally
    // If running locally as requested, we'll just allow it since the user is executing it manually.
    // In production, this should have a secret check like ?key=SUPER_SECRET
    
    const prompts = await Prompt.find({});
    let updatedCount = 0;

    for (const prompt of prompts) {
      const text = (prompt.prompt + " " + prompt.title + " " + (prompt.tags || []).join(" ")).toLowerCase();
      let changed = false;

      // Determine style
      if (!prompt.styleTag) {
        let assignedStyle = "";
        for (const s of STYLES) {
          if (text.includes(s) || (s === "ghibli" && text.includes("studio ghibli")) || (s === "oil-painting" && text.includes("oil painting")) || (s === "pixar" && text.includes("disney"))) {
            assignedStyle = s;
            break;
          }
        }
        if (assignedStyle) {
          prompt.styleTag = assignedStyle;
          changed = true;
        }
      }

      // Determine use case
      if (!prompt.useCaseTag) {
        let assignedUseCase = "";
        for (const u of USE_CASES) {
          if (text.includes(u) || (u === "pet" && (text.includes("dog") || text.includes("cat")))) {
            assignedUseCase = u === "portrait" ? "self-portrait" : u;
            break;
          }
        }
        if (assignedUseCase) {
          prompt.useCaseTag = assignedUseCase;
          changed = true;
        }
      }

      // Determine mood
      if (!prompt.moodTag) {
        let assignedMood = "";
        for (const m of MOODS) {
          if (text.includes(m) || (m === "vintage" && text.includes("retro"))) {
            assignedMood = m;
            break;
          }
        }
        if (assignedMood) {
          prompt.moodTag = assignedMood;
          changed = true;
        }
      }

      if (changed) {
        await prompt.save();
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Backfilled tags for ${updatedCount} out of ${prompts.length} prompts.`,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Backfill error:", err);
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
