import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/clientPromise";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { promptId } = await req.json();
  if (!promptId) {
    return new Response(JSON.stringify({ error: "Prompt ID is required" }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("promptlime");
    const copyLogs = db.collection("copyLogs");

    await copyLogs.insertOne({
      userId: session.user.id,
      promptId,
      copiedAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("❌ Error logging copy:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}