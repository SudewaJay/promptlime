"use client";

import { useState } from "react";

import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Clipboard, Check, X, Flag } from "lucide-react";
import Image from "next/image";

interface PromptCardProps {
  _id?: string;
  category: string;
  tool?: string;
  title: string;
  prompt: string;
  image?: string;
  likes?: number;
  priority?: boolean;
  onClick?: () => void;
}

export default function PromptCard({
  _id,
  category,
  tool,
  title,
  prompt,
  image,
  likes = 0,
  priority = false,
  onClick,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // New Report Modal
  const [modalMessage, setModalMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: session } = useSession();

  const isGemini = (tool || category || "").toLowerCase().includes("gemini");
  const platformName = isGemini ? "Gemini" : "ChatGPT";
  const platformUrl = isGemini ? "https://gemini.google.com/" : "https://chat.openai.com/";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    console.log("📋 Copying prompt:", _id);

    // 0. Strict Guest Check (Client-side Cookie)
    if (!session) {
      const match = document.cookie.match(/(^| )guest_copy_count=([^;]+)/);
      const limit = match ? parseInt(match[2]) : 0;
      if (limit >= 2) {
        setModalMessage("⚠️ Guest limit reached (2/2). Please login for more.");
        setShowModal(true);
        return; // BLOCK COPY
      }
    }

    // 1. Optimistic Copy (Fixes Safari/Mobile async clipboard issues)
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Clipboard error", err);
      // Fallback or just notify failure
      setModalMessage("❌ Failed to copy to clipboard. Please copy manually.");
      setShowModal(true);
      return;
    }

    // 2. Track Copy / Check Limit (Fire & Forget logic with Guard)
    try {
      const res = await fetch(`/api/prompts/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      });

      if (res.status === 403) {
        const data = await res.json();
        setModalMessage(`⚠️ ${data?.error || "Limit reached."}`);
        setShowModal(true);

        // Optional: specific redirect logic for limit
        if (session && data?.error?.includes("limit")) {
          // logic...
        }
        return;
      }

      if (!res.ok) {
        console.error("❌ Copy tracking failed:", res.status);
        // We don't alert the user here because they got the text successfully.
      }
    } catch (err) {
      // Network error tracking copy
      console.error("❌ Tracker error", err);
      // Silent fail on tracking if copy worked
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    const action = isLiked ? "decrementLike" : "incrementLike";
    try {
      await fetch(`/api/prompts/${_id}`, {
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    const shareUrl = `${window.location.origin}/prompt/${_id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setModalMessage("🔗 Prompt link copied!");
      setShowModal(true);
    } catch (err) {
      console.error("❌ Share failed", err);
      setModalMessage("❌ Failed to share prompt.");
      setShowModal(true);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setIsReporting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: _id, reason: reportReason }),
      });

      if (res.ok) {
        setModalMessage("✅ Prompt reported. Thank you.");
        setShowReportModal(false);
        setShowModal(true);
      } else {
        alert("Failed to report prompt.");
      }
    } catch (err) {
      console.error("Report error", err);
    } finally {
      setIsReporting(false);
    }
  };

  const handleOpenPlatform = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    if (!session) {
      const match = document.cookie.match(/(^| )guest_copy_count=([^;]+)/);
      const limit = match ? parseInt(match[2]) : 0;
      if (limit >= 2) {
        setModalMessage("⚠️ Guest limit reached (2/2). Please login for more.");
        setShowModal(true);
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setToastMessage(`Prompt copied — just paste it (Ctrl+V / ⌘V) and hit send`);
      setTimeout(() => setToastMessage(""), 4000);

      fetch(`/api/prompts/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      }).catch(console.error);

      window.open(platformUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("❌ Clipboard error", err);
      setModalMessage("❌ Failed to copy to clipboard.");
      setShowModal(true);
    }
  };

  return (
    <>
      {/* 🌟 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-[#1a1a1a] to-[#111] text-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md overflow-hidden"
          >
            <div className="absolute -inset-4 blur-3xl bg-gradient-to-r from-lime-400/30 via-transparent to-transparent pointer-events-none z-0" />
            <button
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              <X />
            </button>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold text-lime-400 mb-2">
                Notification
              </h2>
              <p className="text-sm text-gray-300 mb-5">{modalMessage}</p>

              {!session && modalMessage.toLowerCase().includes("limit") && (
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-4 py-2.5 rounded-full hover:bg-gray-100 w-full transition"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Login with Google
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 🚨 Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Report Prompt</h3>
            <div className="space-y-2 mb-4">
              {["Inappropriate Content", "Spam / Misleading", "Not Working", "Other"].map((r) => (
                <label key={r} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition">
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reportReason === r}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="accent-lime-400"
                  />
                  <span className="text-sm text-white">{r}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || isReporting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isReporting ? "Sending..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🍞 Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[10000] bg-[#1a1a1a] border border-white/20 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium whitespace-nowrap"
          >
            <Check size={16} className="text-lime-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧩 Prompt Card */}
      <motion.div
        layout
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="flex flex-row items-start gap-3 md:gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg hover:shadow-lime-500/20 transition-all duration-300 cursor-pointer"
      >
        {image && (
          <div className="relative group w-32 h-32 md:w-40 md:h-40 rounded-lg md:rounded-xl overflow-hidden shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 128px, 160px"
              priority={priority}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-xs md:text-sm text-lime-400 font-medium mb-0.5 md:mb-1">
            {tool || "ChatGPT"}
          </div>
          <h2 className="text-base md:text-xl font-semibold text-white mb-1 md:mb-2 line-clamp-1">{title}</h2>
          <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
            {prompt}
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex flex-wrap items-center gap-2">
              {/* ❤️ Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full transition-all ${isLiked
                  ? "bg-red-500/80 text-white"
                  : "bg-white/10 text-red-300 border border-white/20 hover:bg-white/20 hover:text-white"
                  }`}
              >
                <Heart size={14} className="md:w-4 md:h-4" fill={isLiked ? "currentColor" : "none"} />
                {likeCount}
              </button>

              {/* 🔗 Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition"
              >
                <Share2 size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Share</span>
              </button>

              {/* 🚩 Report */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReportModal(true);
                }}
                className="flex items-center gap-1 text-xs md:text-sm px-2 py-1 md:py-1.5 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Report Prompt"
              >
                <Flag size={12} className="md:w-3.5 md:h-3.5" />
              </button>

              {/* 📋 Copy (Right aligned) */}
              <button
                onClick={handleCopy}
                className={`ml-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold border backdrop-blur-md transition-all ${copied
                  ? "bg-lime-500/80 text-white border-lime-400 shadow shadow-lime-300/30"
                  : "bg-white/10 text-lime-300 border-white/20 hover:bg-white/20 hover:text-white"
                  }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <Check size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Copied</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clipboard size={14} className="md:w-4 md:h-4" /> Copy
                  </span>
                )}
              </button>
            </div>

            {/* 🚀 Platform CTA */}
            <button
              onClick={handleOpenPlatform}
              className="ml-auto px-4 py-1.5 rounded-full text-xs md:text-sm font-medium border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-1"
            >
              Open in {platformName} &rarr;
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}