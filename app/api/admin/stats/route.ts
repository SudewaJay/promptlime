import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Prompt from "@/models/Prompt";
import Report from "@/models/Report"; // Imported Report model
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const [userCount, promptCount, reportCount, totalLikes, totalCopies] = await Promise.all([
            User.countDocuments(),
            Prompt.countDocuments(),
            Report.countDocuments({ status: "pending" }), // Count pending reports
            Prompt.aggregate([
                { $group: { _id: null, total: { $sum: "$likes" } } },
            ]).then((res) => res[0]?.total || 0),
            Prompt.aggregate([
                { $group: { _id: null, total: { $sum: "$copyCount" } } },
            ]).then((res) => res[0]?.total || 0),
        ]);

        return NextResponse.json(
            {
                userCount,
                promptCount,
                reportCount, // Return actual report count
                totalLikes,
                totalCopies,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
