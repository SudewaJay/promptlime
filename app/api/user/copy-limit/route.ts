import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { checkAndUpdateCopyLimit } from "@/lib/userLimit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    // Guest limit is now 2
    // However, since we track it via cookie on the client/request side,
    // this API might not be perfectly aware of the client cookie unless passed.
    // For now, let's return a safe placeholder or parsing logic if we want strictness.
    // But simplest is to just return a high number or 2 to indicate the policy.
    // Let's return 2 to align with policy, though client logic handles the cookie check.
    return new Response(JSON.stringify({ remaining: 2 }), { status: 200 });
  }

  const result = await checkAndUpdateCopyLimit(session.user.id);
  return new Response(JSON.stringify({ remaining: result.remaining }), { status: 200 });
}