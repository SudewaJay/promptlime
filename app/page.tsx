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

  // States suitable for server-side filtering
  const [activeTab, setActiveTab] = useState<"trending" | "all">("trending");
  const [activeTool, setActiveTool] = useState<string>("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);

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

  // Derived unique tags from loaded prompts (or could fetch from API)
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);

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
        });
        setUniqueTags(Array.from(tags));

      } catch (err) {
        console.error("❌ Failed to fetch prompts", err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce or just fetch
    const timeout = setTimeout(fetchPrompts, 100);
    return () => clearTimeout(timeout);
  }, [activeTab, activeTool, activeTag]);

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

      <main className="relative z-10 w-full pt-16 pb-12">

        {/* Top Controls: Tools & Toggles */}
        <div id="filter-sentinel" className="h-[1px] w-full pointer-events-none absolute top-[-1px] opacity-0" />
        <div
          className={`sticky top-[64px] z-40 pt-4 pb-12 mb-0 w-full transition-all duration-300 ${isSticky
            ? "bg-gradient-to-b from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent"
            : "bg-transparent"
            }`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="w-full md:w-auto overflow-hidden">
                  {/* Tool Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {tools.map(tool => (
                      <button
                        key={tool._id}
                        onClick={() => setActiveTool(activeTool === tool.name ? "All" : tool.name)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${activeTool === tool.name
                          ? "bg-lime-400 text-black border-lime-400"
                          : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Toggle */}
                <div
                  className="relative w-60 h-10 rounded-full bg-white/5 border border-white/10 flex items-center cursor-pointer shrink-0"
                  onClick={() => {
                    setActiveTab(activeTab === "trending" ? "all" : "trending");
                  }}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-[2px] w-[calc(50%-4px)] h-[calc(100%-4px)] bg-lime-400 rounded-full z-0 transition-all duration-300 ${activeTab === "trending" ? "left-1" : "left-1/2"
                      }`}
                  />
                  <div className="relative z-10 flex justify-between w-full text-sm font-semibold text-white px-2">
                    <div className={`w-1/2 text-center transition-colors ${activeTab === "trending" ? "text-black" : "text-white/60"}`}>
                      Trending
                    </div>
                    <div className={`w-1/2 text-center transition-colors ${activeTab === "all" ? "text-black" : "text-white/60"}`}>
                      Newest
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              {uniqueTags.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-2 border-t border-white/5 mt-2">
                  <span className="text-xs text-white/40 uppercase font-semibold shrink-0">Tags:</span>
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap border ${!activeTag ? "bg-white text-black border-white" : "text-white/50 border-white/10 hover:text-white hover:border-white/30 bg-transparent"
                      }`}
                  >
                    All
                  </button>
                  {uniqueTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap border ${activeTag === tag
                        ? "bg-white text-black border-white"
                        : "text-white/50 border-white/10 hover:text-white hover:border-white/30 bg-transparent"
                        }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
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
                    className="h-48 bg-white/5 rounded-2xl animate-pulse"
                  />
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
