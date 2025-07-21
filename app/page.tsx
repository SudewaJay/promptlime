"use client";

import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative px-6">
      
      {/* 🌈 Lime Blur Background */}
      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      {/* ✨ Title */}
      <h1 className="md:text-7xl text-4xl lg:text-7xl font-semibold text-center text-white relative z-20 mb-8">
        Promptlime Coming Soon
      </h1>
      
      {/* 🌌 Sparkles & Gradients */}
      <div className="relative w-full max-w-4xl h-40">
        {/* Gradient Lines */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-green-400 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-green-400 to-transparent h-px w-1/4" />

        {/* Sparkles */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Mask */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
              {/* Bottom Tagline */}
              <div className="text-center py-4">
                <a
                  href="https://uniixstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-orange-500 to-yellow-500 animate-text text-sm font-medium hover:underline"
                >
                  Product of Uniix Studio
                </a>
              </div>
    </div>
  );
}


/* 
👇 Original homepage preserved below. Will render once you uncomment after launch.

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PromptCard from "@/components/PromptCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalPrompt from "@/components/ModalPrompt";
import { useSearch } from "@/context/SearchContext";
import { SparklesCore } from "@/components/ui/sparkles";

type Prompt = {
  _id?: string;
  title: string;
  category: string;
  prompt: string;
  image?: string;
  copyCount?: number;
};

export default function Home() {
  const { searchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState<"trending" | "all">("trending");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [visibleCount, setVisibleCount] = useState(14);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const isTrending = activeTab === "trending";

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await fetch("/api/prompts");
        const data = await res.json();
        const promptArray = Array.isArray(data) ? data : data.prompts;
        setPrompts(promptArray || []);
      } catch (err) {
        console.error("❌ Failed to fetch prompts", err);
      }
    }
    fetchPrompts();
  }, []);

  const trendingPrompts = [...prompts]
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, 8);

  const filteredPrompts = prompts.filter((prompt) => {
    const query = searchTerm.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(query) ||
      prompt.category.toLowerCase().includes(query)
    );
  });

  const allPrompts = searchTerm ? filteredPrompts : prompts;
  const promptsToShow = isTrending
    ? trendingPrompts
    : allPrompts.slice(0, visibleCount);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f]/80 via-[#0f0f0f]/60 to-[#0f0f0f]/0 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#ffffff"
        />
      </div>

      <Header />

      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="sticky top-20 z-20 bg-transparent pt-4 pb-6 mb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <h1 className="text-3xl font-bold text-left">Promplime – Best ChatGPT Prompts</h1>
            <div
              className="relative w-60 h-12 rounded-full bg-white/10 border border-white/20 flex items-center cursor-pointer"
              onClick={() => {
                setActiveTab(isTrending ? "all" : "trending");
                setVisibleCount(14);
              }}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top w-[calc(50%-4px)] h-10 bg-lime-400 rounded-full z-0 transition-all duration-300 ${
                  isTrending ? "left-1" : "left-1/2"
                }`}
              />
              <div className="relative z-10 flex justify-between w-full text-sm font-semibold text-white px-2">
                <div className={`w-1/2 text-center ${isTrending ? "text-black" : "text-white/70"}`}>
                  Trending
                </div>
                <div className={`w-1/2 text-center ${isTrending ? "text-white/70" : "text-black"}`}>
                  All
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <AnimatePresence mode="popLayout">
            {promptsToShow.map((prompt, index) => (
              <motion.div
                key={prompt._id || index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <PromptCard
                  {...prompt}
                  onClick={() => setSelectedPrompt(prompt)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!isTrending && !searchTerm && visibleCount < allPrompts.length && (
          <div className="text-center mb-20">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2 rounded-full bg-lime-500 hover:bg-lime-400 text-black font-semibold shadow transition"
            >
              Load More
            </button>
          </div>
        )}

        {selectedPrompt && (
          <ModalPrompt
            prompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
        )}

        <Footer />
      </main>
    </div>
  );
}
*/