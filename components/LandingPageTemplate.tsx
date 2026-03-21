"use client";

import { SEO_STYLES } from "@/lib/seo-mapping";
import Link from "next/link";
import { ArrowLeft, Sparkles, Wand2, Search } from "lucide-react";
import PromptCard from "./PromptCard";

interface SEOItem {
  slug: string;
  name: string;
  keyword: string;
}

interface LandingPageProps {
  style: SEOItem;
  platform: SEOItem;
  prompts: {
    _id: string; 
    title: string;
    category: string;
    prompt: string;
    [key: string]: unknown;
  }[];
}

export default function LandingPageTemplate({ style, platform, prompts }: LandingPageProps) {
  const relatedStyles = SEO_STYLES.filter(s => s.slug !== style.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-black selection:bg-lime-500/30">
      {/* SEO Header Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-500/10 via-transparent to-transparent opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-lime-400 transition mb-8 group">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Explorer</span>
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Best <span className="text-lime-400">{style.name}</span> Prompts for <span className="bg-white/5 px-4 py-1 rounded-xl border border-white/10">{platform.name}</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Discover the most curated {style.keyword} collection specifically optimized for {platform.keyword}. 
              Whether you&apos;re creating concept art or high-end visuals, our AI-proven prompts help you achieve 
              the perfect {style.name} aesthetic every time.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-white/80">
                <Sparkles size={14} className="text-lime-400" />
                <span>{prompts.length}+ High Quality Prompts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-white/80">
                <Wand2 size={14} className="text-lime-400" />
                <span>One-Click Copy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Section */}
      <section className="py-12 px-6 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">How to use these {style.name} prompts on {platform.name}</h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>1. Browse the collection below and find a visual reference that matches your vision.</p>
                <p>2. Click <strong>&quot;Copy Prompt&quot;</strong> to get the precisely engineered text for {platform.name}.</p>
                <p>3. Paste it directly into {platform.name} and watch the {style.keyword} magic happen.</p>
                <p className="text-lime-400/80 italic text-sm mt-4 lg:max-w-md">
                  Pro-tip: You can adjust the mood or subject of these prompts while keeping the core {style.name} structure intact.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-gradient-to-br from-lime-400/20 to-lime-600/5 border border-lime-400/10 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
               <Search size={48} className="text-lime-400 animate-pulse" />
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                 <p className="text-xs font-mono text-lime-400">SEO Optimized Library v2.0</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prompt Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">The Collection</h2>
            <div className="h-px flex-1 bg-white/10 ml-8 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {prompts.map((prompt) => (
              <PromptCard 
                key={prompt._id.toString()} 
                {...JSON.parse(JSON.stringify(prompt))} 
              />
            ))}
          </div>

          {prompts.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-white/40 mb-4 text-lg">We&apos;re currently curating more {style.name} prompts for {platform.name}.</p>
              <Link href="/" className="text-lime-400 border-b border-lime-400/20 hover:border-lime-400 transition">
                Explore all prompts in the meantime
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Explorations */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">Explore other styles for {platform.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedStyles.map((s) => (
              <Link 
                key={s.slug} 
                href={`/prompts/${s.slug}-${platform.slug}`}
                className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-lime-400/10 hover:border-lime-400/50 transition-all text-center"
              >
                <p className="text-white/40 text-xs mb-1 group-hover:text-lime-400/80 transition">{platform.name}</p>
                <p className="text-white font-medium text-sm group-hover:text-white transition">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `Best ${style.name} Prompts for ${platform.name}`,
            "description": `Browse the ultimate collection of ${style.keyword} optimized for ${platform.name}. Copy and paste proven prompts for stunning AI art.`,
            "url": `https://promptlime.space/prompts/${style.slug}-${platform.slug}`,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": prompts.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "item": {
                  "@type": "CreativeWork",
                  "name": p.title,
                  "text": p.prompt
                }
              }))
            }
          })
        }}
      />
    </div>
  );
}
