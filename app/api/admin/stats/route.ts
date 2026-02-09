import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Prompt from "@/models/Prompt";
import Report from "@/models/Report";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // Ensure user is admin (you might want to add role check here)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const [userCount, promptCount, reportCount, totalLikes, totalCopies] = await Promise.all([
            User.countDocuments(),
            Prompt.countDocuments(),
            Report.countDocuments({ status: "pending" }),
            Prompt.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]).then(res => res[0]?.total || 0),
            Prompt.aggregate([{ $group: { _id: null, total: { $sum: "$copyCount" } } }]).then(res => res[0]?.total || 0),
        ]);

        // 📊 Get User Growth (Last 30 Days)
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 📝 Get Prompt Creation Trend (Last 30 Days)
        const promptTrend = await Prompt.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return NextResponse.json(
            {
                userCount,
                promptCount,
                reportCount,
                totalLikes,
                totalCopies,
                userGrowth: userGrowth.map(item => ({ date: item._id, count: item.count })),
                promptTrend: promptTrend.map(item => ({ date: item._id, count: item.count })),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
