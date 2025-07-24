import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptActions from "@/components/PromptActions";
import AnimatedCTA from "@/components/AnimatedCTA";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

// Type for the prompt data
type PromptType = {
  _id: string;
  title: string;
  prompt: string;
  category?: string;
  image?: string;
  likes?: number;
  copyCount?: number;
  views?: number;
  createdAt?: string | Date;
};

// Props type for dynamic route with id
interface PromptPageProps {
  params: {
    id: string;
  };
}

export default async function PromptPage({ params }: PromptPageProps) {
  await connectToDatabase();

  const result = await Prompt.findByIdAndUpdate(
    params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!result || !("title" in result) || !("prompt" in result)) {
    return notFound();
  }

  const prompt: PromptType = {
    _id: String(result._id),
    title: result.title,
    prompt: result.prompt,
    category: result.category,
    image: result.image,
    likes: result.likes,
    copyCount: result.copyCount,
    views: result.views,
    createdAt: result.createdAt,
  };

  const shareUrl =
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/prompt/${prompt._id}`;

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      {/* 🌈 Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 🖼️ Image */}
          {prompt.image && (
            <div className="relative w-full md:w-64 h-64 rounded-xl overflow-hidden">
              <Image
                src={prompt.image}
                alt={prompt.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 16rem"
                priority
              />
            </div>
          )}

          {/* 📄 Content */}
          <div className="flex-1">
            <div className="text-sm text-lime-400 mb-2">{prompt.category}</div>
            <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>

            <pre className="bg-white/5 text-sm p-4 rounded-md border border-white/10 whitespace-pre-wrap mb-6 max-h-80 overflow-y-auto">
              {prompt.prompt}
            </pre>

            {/* 🎛️ Actions */}
            <PromptActions
              _id={params.id}
              likes={prompt.likes}
              copyCount={prompt.copyCount}
              shareUrl={shareUrl}
            />

            {/* 📊 Stats */}
            <div className="text-sm text-white/60 flex flex-wrap gap-4 mt-4">
              <span>📋 {prompt.copyCount ?? 0} copies</span>
              <span>👁️ {prompt.views ?? 0} views</span>
              {prompt.createdAt && (
                <span>
                  🕒{" "}
                  {formatDistanceToNow(new Date(prompt.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatedCTA />
      <Footer />
    </div>
  );
}