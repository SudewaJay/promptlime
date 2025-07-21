"use client";

import { useState } from "react";
import { Clipboard, Check, Heart, Share2 } from "lucide-react";

interface Props {
  _id: string;
  likes?: number;
  // Removed copyCount since it's unused
}

export default function PromptActions({ _id, likes = 0 }: Props) {
  const [copied, setCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const shareUrl = `${window.location.origin}/prompt/${_id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      await fetch(`/api/prompts/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Copy failed", err);
    }
  };

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
      {/* 📋 Copy */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-all border backdrop-blur-md ${
          copied
            ? "bg-lime-500/80 text-white border-lime-400 shadow shadow-lime-300/30"
            : "bg-white/10 text-lime-300 border-white/20 hover:bg-white/20 hover:text-white"
        }`}
      >
        {copied ? <Check size={16} /> : <Clipboard size={16} />}
        {copied ? "Copied" : "Copy Prompt"}
      </button>

      {/* ❤️ Like */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full transition-all ${
          isLiked
            ? "bg-red-500/80 text-white"
            : "bg-white/10 text-red-300 border border-white/20 hover:bg-white/20 hover:text-white"
        }`}
      >
        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        {likeCount}
      </button>

      {/* 🔗 Share */}
      <button
        onClick={handleCopy} // This copies the same URL as Copy, so it's OK if intentional
        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition"
      >
        <Share2 size={16} /> Share
      </button>
    </div>
  );
}