"use client";

import { useState } from "react";
import { Clipboard, Check, Heart, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface Props {
  _id: string;
  likes?: number;
  copyCount?: number;
  shareUrl: string
}

export default function PromptActions({ _id, likes = 0, shareUrl, prompt }: Props & { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const { data: session } = useSession();

  // Handle Copy Prompt
  const handleCopyPrompt = async () => {
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
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Clipboard error", err);
      alert("❌ Failed to copy prompt to clipboard.");
      return;
    }

    // 2. Track Copy
    try {
      const res = await fetch(`/api/prompts/${_id}`, {
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
      console.error("❌ Copy tracking failed", err);
    }
  };

  // Handle Share (Copy URL)
  const handleShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("🔗 Link copied to clipboard!");
    } catch (err) {
      console.error("❌ Share failed", err);
    }
  };

  // Handle Like / Unlike
  const handleLike = async () => {
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
      console.error("❌ Like toggle failed", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-3">
      {/* 📋 Copy Button */}
      <button
        onClick={handleCopyPrompt}
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-all active:scale-95 border backdrop-blur-md ${copied
          ? "bg-lime-500/80 text-white border-lime-400 shadow shadow-lime-300/30"
          : "bg-white/10 text-lime-300 border-white/20 hover:bg-white/20 hover:text-white"
          }`}
      >
        {copied ? <Check size={16} /> : <Clipboard size={16} />}
        {copied ? "Copied" : "Copy Prompt"}
      </button>

      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-all active:scale-95 ${isLiked
          ? "bg-red-500/80 text-white"
          : "bg-white/10 text-red-300 border border-white/20 hover:bg-white/20 hover:text-white"
          }`}
      >
        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        {likeCount}
      </button>

      {/* 🔗 Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition-all active:scale-95"
      >
        <Share2 size={16} /> Share
      </button>
    </div>
  );
}