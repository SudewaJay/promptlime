
import { NextResponse } from "next/server";

export async function GET() {
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    return NextResponse.json({
        ADMIN_USERNAME_SET: !!adminUser,
        ADMIN_PASSWORD_SET: !!adminPass,
        ADMIN_USERNAME_VALUE: adminUser ? adminUser : "NOT SET", // Safe to show username
        ADMIN_PASSWORD_LENGTH: adminPass ? adminPass.length : 0, // Show length only
        NODE_ENV: process.env.NODE_ENV,
    });
}
