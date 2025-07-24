import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { checkAndUpdateCopyLimit } from "@/lib/userLimit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ remaining: 1 }), { status: 200 });
  }

  const result = await checkAndUpdateCopyLimit(session.user.id);
  return new Response(JSON.stringify({ remaining: result.remaining }), { status: 200 });
}