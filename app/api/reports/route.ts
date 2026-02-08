import connectToDatabase from "@/lib/mongodb";
import Report from "@/models/Report";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { promptId, reason } = await req.json();

        if (!promptId || !reason) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectToDatabase();

        const newReport = await Report.create({
            promptId,
            reporterId: session.user.id,
            reason,
            status: "pending",
        });

        return NextResponse.json({ success: true, report: newReport }, { status: 201 });
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // Add admin check
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // Explicitly populate Prompt to ensure we get prompt details
        const reports = await Report.find({ status: "pending" })
            .populate("promptId")
            .populate("reporterId", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ reports }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reportId, status } = await req.json();

        await connectToDatabase();

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status },
            { new: true }
        );

        return NextResponse.json({ success: true, report: updatedReport }, { status: 200 });
    } catch (error) {
        console.error("Error updating report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
