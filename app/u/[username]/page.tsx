import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Prompt from "@/models/Prompt";
import Result from "@/models/Result";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Crown, Heart, CheckCircle2 } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import PromptCard from "@/components/PromptCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 🧑 User Header Card */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-lime-400/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-lime-400/20 shadow-2xl shadow-lime-400/10 group-hover:scale-105 transition-transform duration-500">
              <SafeImage 
                src={user.image || "/default-avatar.png"} 
                alt={user.name || "User"} 
                fill 
                className="object-cover"
              />
            </div>

            <div className="text-center md:text-left flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">{user.name}</h1>
                <p className="text-lime-400 font-mono text-sm tracking-widest uppercase opacity-80">@{user.username}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                 <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs text-white/50 border border-white/5 font-medium">
                   Since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2026'}
                 </div>
                 {user.isPro ? (
                   <div className="bg-lime-400/10 border border-lime-400/20 px-4 py-2 rounded-2xl text-xs text-lime-400 font-bold uppercase tracking-widest flex items-center gap-2">
                     <Crown size={14} className="text-yellow-400" />
                     PRO MEMBER
                   </div>
                 ) : (
                   isOwnProfile && <UpgradeButton />
                 )}
              </div>
            </div>

            {/* 📊 Rapid Stats */}
            <div className="flex gap-4 md:flex-col lg:flex-row h-full">
               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl min-w-[140px] text-center backdrop-blur-sm">
                  <div className="text-2xl font-black text-lime-400 mb-1">{savedPrompts.length}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center justify-center gap-1.5">
                    <Heart size={10} className="text-white/20" /> Saved
                  </div>
               </div>
               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl min-w-[140px] text-center backdrop-blur-sm">
                  <div className="text-2xl font-black text-white mb-1">{results.length}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={10} className="text-white/20" /> Results
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-20">
            {/* Saved Prompts Section */}
            <section id="saved">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Collection</h2>
                <div className="h-px flex-1 bg-white/5" />
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
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-white/20 text-lg font-medium">No prompts saved yet.</p>
                  <p className="text-white/10 text-sm mt-2">Browse the gallery and click the heart icon to save.</p>
                </div>
              )}
            </section>

            {/* User Submissions (Results) */}
            <section id="results">
               <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Success Stories</h2>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(results as any[]).map((res: any) => (
                    <div key={res._id.toString()} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-lime-400/30 transition-all duration-500">
                      <div className="grid grid-cols-2 aspect-video relative">
                        <div className="relative border-r border-white/5 overflow-hidden">
                          <SafeImage src={res.beforeImage} alt="Before" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white/80 uppercase font-black tracking-widest">Before</span>
                        </div>
                        <div className="relative overflow-hidden">
                          <SafeImage src={res.afterImage} alt="After" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <span className="absolute bottom-3 right-3 bg-lime-400 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-black uppercase font-black tracking-widest">After</span>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <p className="text-[10px] text-lime-400 font-black uppercase tracking-[0.2em] opacity-60">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          PROMPT: {(res.promptId as any)?.title || 'Untitled'}
                        </p>
                        <p className="text-sm text-white/70 leading-relaxed font-medium">
                          {res.caption || "Amazing results using this prompt on PromptLime!"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-white/20 text-lg font-medium">No success stories yet.</p>
                  <p className="text-white/10 text-sm mt-2">Open any prompt and click &quot;Submit Result&quot; to share your work.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
