import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptDisplay from "@/components/PromptDisplay";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const prompt = await Prompt.findOne({ slug });

  if (!prompt) return { title: "Prompt Not Found | PromptLime" };

  return {
    title: `${prompt.title} | AI Prompt on PromptLime`,
    description: `Check out this AI image prompt: ${prompt.title}. Transform your images with high-quality prompts on PromptLime.`,
    openGraph: {
      title: `${prompt.title} | Premium AI Prompt`,
      description: prompt.prompt.slice(0, 160) + "...",
      images: prompt.image ? [{ url: prompt.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: prompt.title,
      description: prompt.prompt.slice(0, 160) + "...",
      images: prompt.image ? [prompt.image] : [],
    },
  };
}

export default async function SharedPromptPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const prompt = await Prompt.findOne({ slug }).lean();

  if (!prompt) notFound();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            {prompt.image && (
              <div className="relative w-full md:w-1/2 aspect-square">
                <Image
                  src={prompt.image}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content Section */}
            <div className={`p-8 flex flex-col justify-center ${prompt.image ? "md:w-1/2" : "w-full"}`}>
              <div className="text-lime-400 font-medium text-sm mb-2 uppercase tracking-widest">
                {prompt.tool} Prompt
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                {prompt.title}
              </h1>
              
              <div className="mb-8">
                <PromptDisplay text={prompt.prompt} />
              </div>

              <Link 
                href={`/?promptId=${prompt._id}`}
                className="inline-flex items-center justify-center bg-lime-400 text-black font-bold py-4 px-8 rounded-full hover:bg-lime-300 transition-all shadow-lg shadow-lime-400/20 transform hover:-translate-y-1 active:scale-95"
              >
                Use this Prompt &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
