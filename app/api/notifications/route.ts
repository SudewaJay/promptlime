import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import Notification from "@/models/Notification";
// import mongoose from "mongoose";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await clientPromise; // Ensure DB connection

        // Fetch notifications for the logged-in user, sorted by newest first
        const notifications = await Notification.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 for now

        // Count unread
        const unreadCount = await Notification.countDocuments({
            userId: session.user.id,
            isRead: false,
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
        }

        await clientPromise;

        // Mark as read
        const updated = await Notification.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, notification: updated });
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { error: "Failed to update notification" },
            { status: 500 }
        );
    }
}
