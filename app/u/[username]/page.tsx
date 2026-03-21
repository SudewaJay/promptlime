import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Prompt from "@/models/Prompt";
import Result from "@/models/Result";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Crown } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import PromptCard from "@/components/PromptCard";
import UpgradeButton from "@/components/UpgradeButton";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s Profile - PromptLime`,
    description: `See ${username}'s saved prompts and submitted AI results on PromptLime.`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  await dbConnect();

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const user = await User.findOne({ username }).lean() as any;
  if (!user) {
    notFound();
  }

  // Fetch saved prompts
  const savedPrompts = await Prompt.find({
    _id: { $in: user.savedPrompts },
  }).lean();

  // Fetch submitted results
  const results = await Result.find({
    userId: user._id,
  })
    .populate("promptId", "title")
    .sort({ createdAt: -1 })
    .lean();

  const isOwnProfile = session?.user?.id === user._id.toString();

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* User Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-lime-400/20 shadow-xl shadow-lime-400/5">
            <SafeImage 
              src={user.image || "/default-avatar.png"} 
              alt={user.name || "User"} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-lime-400 font-mono text-sm tracking-widest mb-4">@{user.username}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="bg-white/10 px-4 py-1.5 rounded-full text-xs text-white/60">
                 Joined {new Date(user.createdAt!).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
               </div>
               {user.isPro ? (
                 <div className="bg-lime-400/10 border border-lime-400/20 px-4 py-1.5 rounded-full text-xs text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <Crown size={12} className="text-yellow-400" />
                   PRO MEMBER
                 </div>
               ) : (
                 isOwnProfile && <UpgradeButton />
               )}
            </div>
          </div>
        </div>

        {/* Tabs - Simplified for now */}
        <div className="space-y-20">
          {/* Saved Prompts Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Saved Prompts</h2>
              <span className="bg-lime-400/10 text-lime-400 px-3 py-1 rounded-full text-xs font-bold border border-lime-400/20">
                {savedPrompts.length}
              </span>
            </div>
            {savedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(savedPrompts as any[]).map((prompt: any) => (
                  <PromptCard 
                    key={prompt._id.toString()} 
                    {...JSON.parse(JSON.stringify(prompt))} 
                    isSavedInitial={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <p className="text-white/30 text-lg">No prompts saved yet.</p>
              </div>
            )}
          </section>

          {/* User Submissions (Results) */}
          <section>
             <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Result Submissions</h2>
              <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-xs font-bold">
                {results.length}
              </span>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(results as any[]).map((res: any) => (
                                  <div key={res._id.toString()} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                    <div className="grid grid-cols-2 aspect-video relative">
                      <div className="relative border-r border-white/10 overflow-hidden">
                        <SafeImage src={res.beforeImage} alt="Before" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white/80 uppercase font-bold tracking-tighter">Before</span>
                      </div>
                      <div className="relative overflow-hidden">
                        <SafeImage src={res.afterImage} alt="After" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 right-2 bg-lime-500/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-black uppercase font-bold tracking-tighter">After</span>
                      </div>
                    </div>
                    <div className="p-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <p className="text-xs text-lime-400 font-mono mb-1 truncate">Prompt: {(res.promptId as any)?.title || 'Untitled'}</p>
                      <p className="text-sm text-white/80 line-clamp-2">{res.caption || "Success with PromptLime!"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <p className="text-white/30 text-lg">No results submitted yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
