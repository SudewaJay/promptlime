"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PromptCard from "@/components/PromptCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCardSkeleton from "@/components/PromptCardSkeleton";
import dynamic from "next/dynamic";
const ModalPrompt = dynamic(() => import("@/components/ModalPrompt"), { ssr: false });
import { useSearch } from "@/context/SearchContext";
import { SparklesCore } from "@/components/ui/sparkles";
import { useRouter } from "next/navigation";

const STYLES = ["cinematic", "anime", "ghibli", "pixar", "watercolor", "oil-painting", "cyberpunk", "vintage", "fantasy", "minimal", "3d"];
const USE_CASES = ["self-portrait", "product", "landscape", "group", "pet", "food", "portrait"];
const MOODS = ["dark", "vibrant", "warm", "dreamy", "retro", "minimal"];

type Prompt = {
  _id?: string;
  title: string;
  category: string;
  tool?: string;
  tags?: string[];
  prompt: string;
  image?: string;
  copyCount?: number;
  views?: number;
  likes?: number;
  createdAt: string;
};

type Tool = {
  _id: string;
  name: string;
  slug: string;
};

export default function Home() {
  const { searchTerm } = useSearch();

  const router = useRouter();
  
  // States suitable for server-side filtering
  const [activeTab, setActiveTab] = useState<"trending" | "all">("trending");
  const [activeTool, setActiveTool] = useState<string>("All");
  const [activeTag] = useState<string | null>(null);
  
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [activeUseCases, setActiveUseCases] = useState<string[]>([]);
  const [activeMoods, setActiveMoods] = useState<string[]>([]);
  
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Read URL params initially
    const params = new URLSearchParams(window.location.search);
    setActiveStyles(params.get("style")?.split(",").filter(Boolean) || []);
    setActiveUseCases(params.get("useCase")?.split(",").filter(Boolean) || []);
    setActiveMoods(params.get("mood")?.split(",").filter(Boolean) || []);
  }, []);

  const updateUrlParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Scroll Listener for Sticky State
  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky state based on scroll position
      // > 10px affords a small buffer before transition triggers
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);



  // Fetch Tools
  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/tools");
        if (res.ok) {
          const data = await res.json();
          setTools(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to fetch tools", e);
      }
    }
    fetchTools();
  }, []);

  // Fetch Prompts on Filter Change
  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTool !== "All") params.append("tool", activeTool);
        if (activeTag) params.append("tag", activeTag);
        if (activeStyles.length > 0) params.append("style", activeStyles.join(","));
        if (activeUseCases.length > 0) params.append("useCase", activeUseCases.join(","));
        if (activeMoods.length > 0) params.append("mood", activeMoods.join(","));

        // Sorting logic handled by API
        // "trending" -> sort by popularity
        // "all" -> sort by date (newest)
        params.append("sort", activeTab);

        const res = await fetch(`/api/prompts?${params.toString()}`);
        const data = await res.json();
        const promptArray = Array.isArray(data) ? data : data.prompts || [];
        setPrompts(promptArray);

        // Extract tags from this batch (or aggregate all)
        // Simple aggregation from current prompts
        const tags = new Set<string>();
        promptArray.forEach((p: Prompt) => {
          if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach(t => tags.add(t));
          }
        });      } catch (err) {
        console.error("❌ Failed to fetch prompts", err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce or just fetch
    const timeout = setTimeout(fetchPrompts, 100);
    return () => clearTimeout(timeout);
  }, [activeTab, activeTool, activeTag, activeStyles, activeUseCases, activeMoods]);

  // Client-side search filtering
  const filteredPrompts = prompts.filter((prompt) => {
    const query = searchTerm.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(query) ||
      prompt.category.toLowerCase().includes(query) ||
      (prompt.tool && prompt.tool.toLowerCase().includes(query)) ||
      (prompt.prompt && prompt.prompt.toLowerCase().includes(query)) ||
      (prompt.tags && prompt.tags.some(t => t.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f]/60 via-[#0f0f0f]/40 to-[#0f0f0f]/0 text-white">
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

      <main className="relative z-10 w-full pt-[85px] pb-12">

        {/* Top Controls: Tools & Toggles */}
        <div id="filter-sentinel" className="h-[1px] w-full pointer-events-none absolute top-[-1px] opacity-0" />
        <div
          className={`sticky top-[78px] md:top-[80px] z-40 pt-2 pb-6 w-full transition-all duration-300 ${isSticky
            ? "bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50"
            : "bg-transparent"
            }`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* 🛠️ Tools List (Horizontal Scroll) */}
                <div className="w-full md:w-auto relative group">
                  {/* Fade Gradients (Only visible when sticky to match bg) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none md:hidden transition-opacity duration-300 ${isSticky ? "opacity-100" : "opacity-0"}`} />
                  <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none md:hidden transition-opacity duration-300 ${isSticky ? "opacity-100" : "opacity-0"}`} />

                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1 md:px-0">
                    <button
                      onClick={() => setActiveTool("All")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${activeTool === "All"
                        ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                    >
                      All Tools
                    </button>
                    {tools.map(tool => (
                      <button
                        key={tool._id}
                        onClick={() => setActiveTool(activeTool === tool.name ? "All" : tool.name)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${activeTool === tool.name
                          ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🔥 Trending Toggle (Compact Mobile) */}
                <div className="flex items-center justify-between md:justify-end gap-3">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                    {/* Mobile: Tabs style, Desktop: Pill style */}
                    <button
                      onClick={() => setActiveTab("trending")}
                      className={`relative flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "trending" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                    >
                      Trending
                      {activeTab === "trending" && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-lime-400/10 rounded-lg border border-lime-400/20" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`relative flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "all" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                    >
                      Newest
                      {activeTab === "all" && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-lime-400/10 rounded-lg border border-lime-400/20" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 🏷️ Filter Categories */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5 pb-1 w-full">
                
                {/* STYLES */}
                <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4 mr-2">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider shrink-0 mr-1">Style</span>
                  {STYLES.map(tag => {
                    const isActive = activeStyles.includes(tag);
                    return (
                      <button
                        key={`style-${tag}`}
                        onClick={() => {
                          const next = isActive ? activeStyles.filter(s => s !== tag) : [...activeStyles, tag];
                          setActiveStyles(next);
                          updateUrlParam("style", next);
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap border ${isActive
                          ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>

                {/* USE CASE */}
                <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4 mr-2">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider shrink-0 mr-1">Task</span>
                  {USE_CASES.map(tag => {
                    const isActive = activeUseCases.includes(tag);
                    return (
                      <button
                        key={`useCase-${tag}`}
                        onClick={() => {
                          const next = isActive ? activeUseCases.filter(s => s !== tag) : [...activeUseCases, tag];
                          setActiveUseCases(next);
                          updateUrlParam("useCase", next);
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap border ${isActive
                          ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>

                {/* MOOD */}
                <div className="flex items-center gap-2 shrink-0 pr-4">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider shrink-0 mr-1">Mood</span>
                  {MOODS.map(tag => {
                    const isActive = activeMoods.includes(tag);
                    return (
                      <button
                        key={`mood-${tag}`}
                        onClick={() => {
                          const next = isActive ? activeMoods.filter(s => s !== tag) : [...activeMoods, tag];
                          setActiveMoods(next);
                          updateUrlParam("mood", next);
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap border ${isActive
                          ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <AnimatePresence mode="popLayout">
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <PromptCardSkeleton />
                  </motion.div>
                ))
              ) : filteredPrompts.length === 0 ? (
                <div className="col-span-1 md:col-span-2 text-center py-20 text-white/40">
                  <p>No prompts found matching your filters.</p>
                </div>
              ) : (
                filteredPrompts.map((prompt, index) => (
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
                      priority={index < 6}
                      onClick={() => setSelectedPrompt(prompt)}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {selectedPrompt && (
            <ModalPrompt
              prompt={selectedPrompt}
              onClose={() => setSelectedPrompt(null)}
            />
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}
