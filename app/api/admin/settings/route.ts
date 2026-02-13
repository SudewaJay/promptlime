import connectToDatabase from "@/lib/mongodb";
import SystemSetting from "@/models/SystemSetting";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
    try {
        await connectToDatabase();

        // Check if user is admin is ideal, but let's check session at least
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const key = searchParams.get("key");

        if (key) {
            const setting = await SystemSetting.findOne({ key });
            return NextResponse.json({ value: setting ? setting.value : null });
        }

        const settings = await SystemSetting.find({});
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) { // Add admin check here if 'role' exists in session
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { key, value } = await req.json();

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 });
        }

        const setting = await SystemSetting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        return NextResponse.json(setting);
    } catch (error) {
        console.error("Error saving setting:", error);
        return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
    }
}
