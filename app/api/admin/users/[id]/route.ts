import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15 async params
) {
    try {
        const session = await getServerSession(authOptions);
        // Add admin check if needed: if (session?.user?.email !== process.env.ADMIN_EMAIL) ...
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // Await params as required in Next.js 15
        const { id } = await params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
