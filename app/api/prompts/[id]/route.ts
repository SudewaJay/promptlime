import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { action } = await req.json();

    const updateOps: any = {};

    switch (action) {
      case "incrementCopyCount":
        updateOps.$inc = { copyCount: 1 };
        break;
      case "incrementView":
        updateOps.$inc = { views: 1 };
        break;
      case "incrementLike":
        updateOps.$inc = { likes: 1 };
        break;
      case "decrementLike":
        updateOps.$inc = { likes: -1 };
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    const updated = await Prompt.findByIdAndUpdate(params.id, updateOps, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, prompt: updated });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}