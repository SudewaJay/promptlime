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

  // Double check username exists (it should from the sign-in event or migration)
  if (!session.user.username) {
    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (user) {
      if (user.username) {
        redirect(`/u/${user.username}`);
      } else {
        // Emergency generation if migration missed it
        const baseName = user.name || user.email?.split('@')[0] || "user";
        let username = slugify(baseName, { lower: true, strict: true });
        const exists = await User.findOne({ username });
        if (exists) username = `${username}-${Math.floor(Math.random() * 1000)}`;
        
        user.username = username;
        await user.save();
        redirect(`/u/${username}`);
      }
    }
    
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
          <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium">Finalizing your profile...</p>
          <p className="text-white/40 text-sm">This will only take a moment.</p>
        </div>
    );
  }
  
  redirect(`/u/${session.user.username}`);
}