import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function ProfileRedirect() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/signin");
  }

  // Double check username exists (it should from the sign-in event)
  if (!session.user.username) {
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (user?.username) {
      redirect(`/u/${user.username}`);
    }
    // Fallback if somehow still missing (extremely rare)
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <p>Setting up your profile...</p>
        </div>
    );
  }
  
  redirect(`/u/${session.user.username}`);
}