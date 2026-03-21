"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clipboard, Check, Heart, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import PromptDisplay from "./PromptDisplay";
import ShareSheet from "./ShareSheet";
import slugify from "slugify";
import { getImageUrl } from "@/lib/r2";
import SafeImage from "./SafeImage";
import SubmitResultModal from "./SubmitResultModal";
import { signIn } from "next-auth/react";

type Prompt = {
  _id?: string;
  title: string;
  category: string;
  tool?: string;
  prompt: string;
  image?: string;
  createdAt?: string;
  likes?: number;
  copyCount?: number;
  views?: number;
  slug?: string;
};

export default function ModalPrompt({
  prompt,
  onClose,
}: {
  prompt: Prompt | null;
  onClose: () => void;
}) {
  const { data: session } = useSession();

  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(prompt?.likes || 0);
  const [modalView, setModalView] = useState<"prompt" | "interstitial">("prompt");
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);


  const isGemini = (prompt?.tool || prompt?.category || "").toLowerCase().includes("gemini");
  const platformName = isGemini ? "Gemini" : "ChatGPT";
  const platformUrl = isGemini ? "https://gemini.google.com/" : "https://chat.openai.com/";

  useEffect(() => {
    if (prompt?._id) {
      fetch(`/api/prompts/${prompt._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementView" }),
      });
    }
  }, [prompt]);

  if (!prompt) return null;

  const handleCopy = async () => {
    if (!prompt._id) return;

    // 0. Strict Guest Check (Client-side Cookie)
    if (!session) {
      const match = document.cookie.match(/(^| )guest_copy_count=([^;]+)/);
      const limit = match ? parseInt(match[2]) : 0;
      if (limit >= 2) {
        alert("⚠️ Guest limit reached (2/2). Please login for more.");
        return; // BLOCK COPY
      }
    }

    // 1. Optimistic Copy
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Clipboard error", err);
      alert("❌ Failed to copy to clipboard. Please copy manually.");
      return;
    }

    // 2. Track Copy
    try {
      const res = await fetch(`/api/prompts/${prompt._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      });

      if (res.status === 403) {
        const data = await res.json();
        alert(`⚠️ ${data?.error || "Limit reached."}`);
        return;
      }
    } catch (err) {
      console.error("❌ Tracker error", err);
    }
  };


  const handleLike = async () => {
    if (!prompt._id) return;
    const action = isLiked ? "decrementLike" : "incrementLike";

    try {
      await fetch(`/api/prompts/${prompt._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setIsLiked(!isLiked);
      setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    } catch (err) {
      console.error("❌ Like error", err);
    }
  };

  const handleShare = async () => {
    if (!prompt._id) return;
    
    // Generate share data
    // Use prompt.slug if available, otherwise generate it on the fly for the URL
    const finalSlug = prompt.slug || slugify(prompt.title, { lower: true, strict: true });
    const shareUrl = `${window.location.origin}/p/${finalSlug}`;
    const shareTitle = `${prompt.title} — PromptLime`;
    const shareText = `Check out this AI image prompt: ${prompt.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Native share failed", err);
      }
    }

    setShowShareSheet(true);
  };

  const handleOpenPlatform = async () => {
    if (!prompt._id) return;

    if (!session) {
      const match = document.cookie.match(/(^| )guest_copy_count=([^;]+)/);
      const limit = match ? parseInt(match[2]) : 0;
      if (limit >= 2) {
        alert("⚠️ Guest limit reached (2/2). Please login for more.");
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(prompt.prompt);
      
      fetch(`/api/prompts/${prompt._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      }).catch(console.error);

      setModalView("interstitial");
    } catch (err) {
      console.error("❌ Clipboard error", err);
      alert("❌ Failed to copy to clipboard.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center px-4 pt-20 pb-20 sm:py-20"
        onClick={onClose}
      >
        <motion.div
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[#121212] w-full max-w-4xl rounded-2xl p-6 shadow-xl border border-white/10 relative text-white max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ❌ Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/50 backdrop-blur-md p-2 rounded-full z-10 transition-colors"
          >
            <X size={20} />
          </button>

          {modalView === "prompt" ? (
            /* 🧩 Layout: Image + Content */
            <div className="flex flex-col md:flex-row gap-6">
              {/* 🖼️ Image */}
              {prompt.image && (
                <div className="relative w-full md:w-60 h-64 md:h-64 rounded-xl overflow-hidden shrink-0">
                  <SafeImage
                    src={getImageUrl(prompt.image, 800)}
                    alt={prompt.title}
                    fallbackText={prompt.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 240px"
                    priority
                  />
                </div>
              )}

              {/* 📄 Text Content */}
              <div className="flex-1 flex flex-col">
                <div className="text-sm text-lime-400 mb-1">{prompt.tool || prompt.category}</div>
                <h2 className="text-2xl font-bold mb-3">{prompt.title}</h2>
                <PromptDisplay text={prompt.prompt} />

                {/* 🎛️ Actions and Stats */}
                <div className="flex flex-col mt-4 w-full gap-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 w-full">
                    {/* Buttons */}
                    <div className="flex gap-3">
                      {/* 📋 Copy */}
                      <button
                        onClick={handleCopy}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-md transition-all ${copied
                          ? "bg-lime-500/80 text-white border-lime-400 shadow shadow-lime-300/30"
                          : "bg-white/10 text-lime-300 border-white/20 hover:bg-white/20 hover:text-white"
                          }`}
                      >
                        {copied ? (
                          <span className="flex items-center gap-1">
                            <Check size={16} /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clipboard size={16} /> Copy
                          </span>
                        )}
                      </button>

                      {/* ❤️ Like */}
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-all ${isLiked
                          ? "bg-red-500/80 text-white"
                          : "bg-white/10 text-red-300 border border-white/20 hover:bg-white/20 hover:text-white"
                          }`}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                        {likeCount}
                      </button>

                      {/* 🔗 Share */}
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition"
                      >
                        <Share2 size={16} /> Share
                      </button>

                      {/* 📤 Submit Result */}
                      <button
                        onClick={() => {
                          if (!session) {
                            signIn("google");
                            return;
                          }
                          setShowSubmitModal(true);
                        }}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 border border-lime-500/20 transition font-bold"
                      >
                        Submit Result
                      </button>
                    </div>

                    {/* 📊 Stats */}
                    <div className="text-xs text-white/50 flex gap-4">
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

                  {/* 🚀 Platform CTA */}
                  <div>
                    <button
                      onClick={handleOpenPlatform}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-1 w-fit"
                    >
                      Open in {platformName} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 🚀 Interstitial View */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center p-2 sm:p-6"
            >
              <div className="bg-lime-500/20 text-lime-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6 flex items-center gap-2">
                <Check size={16} /> Prompt copied to clipboard
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-semibold bg-white/10 px-2 flex items-center gap-1 py-1 rounded text-white/80 uppercase tracking-widest">
                  {platformName}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to generate</h2>
              
              <p className="text-gray-300 md:text-lg mb-8 max-w-lg mx-auto">
                Open {platformName}, click the input box, press <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 rounded-md text-sm mx-1 font-sans">⌘V</kbd> (Mac) or <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 rounded-md text-sm mx-1 font-sans">Ctrl+V</kbd> (Windows) to paste your prompt &mdash; then add your photo and hit send.
              </p>

              <div className="w-full max-w-lg mb-8 bg-black/40 border border-white/10 p-5 rounded-xl text-left text-sm text-gray-300 italic relative">
                <span className="text-lime-400/50 absolute top-2 right-4 text-3xl font-serif">&quot;</span>
                {prompt.prompt.slice(0, 100)}{prompt.prompt.length > 100 ? '...' : ''}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button 
                  onClick={() => {
                    window.open(platformUrl, '_blank');
                    onClose();
                  }}
                  className="flex-1 bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Open {platformName} &rarr;
                </button>
                <button 
                  onClick={() => setModalView("prompt")}
                  className="flex-1 bg-white/10 text-white font-medium py-3 px-6 rounded-full hover:bg-white/20 border border-white/10 transition-colors"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* 📤 Share Sheet */}
      <ShareSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        shareUrl={prompt ? `${window.location.origin}/p/${prompt.slug || slugify(prompt.title, { lower: true, strict: true })}` : ""}
        shareText={`Check out this AI image prompt: ${prompt?.title}`}
      />
      {/* 📤 Submit Result Modal */}
      {showSubmitModal && prompt?._id && (
        <SubmitResultModal
          promptId={prompt._id}
          promptTitle={prompt.title}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </AnimatePresence>
  );
}