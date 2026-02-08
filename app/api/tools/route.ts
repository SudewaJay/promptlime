import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Tool from "@/models/Tool";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET: Fetch all tools
export async function GET() {
    try {
        await connectToDatabase();
        // Sort by name for better UI
        const tools = await Tool.find().sort({ name: 1 });
        return NextResponse.json(tools, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

// POST: Create a new tool
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { name, icon } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const existingTool = await Tool.findOne({ slug });
        if (existingTool) {
            return NextResponse.json({ error: "Tool already exists" }, { status: 400 });
        }

        const newTool = await Tool.create({ name, slug, icon });
        return NextResponse.json(newTool, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating tool:", error);
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
    }
}

// DELETE: Remove a tool
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await connectToDatabase();
        await Tool.findByIdAndDelete(id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("❌ Error deleting tool:", error);
        return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
    }
}
