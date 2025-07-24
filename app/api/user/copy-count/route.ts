import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/clientPromise";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ count: 0 }), { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await clientPromise;
    const db = client.db("promptlime"); // ✅ Change to your DB name if different
    const copyLogs = db.collection("copyLogs");

    const copyCount = await copyLogs.countDocuments({ userId });

    return new Response(JSON.stringify({ count: copyCount }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Error getting copy count:", err);
    return new Response(JSON.stringify({ count: 0, error: "Server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}