"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Clipboard, Check } from "lucide-react";

interface PromptCardProps {
  _id?: string;
  category: string;
  title: string;
  prompt: string;
  image?: string;
  likes?: number;
  copyCount?: number;
  views?: number;
  onClick?: () => void;
}

export default function PromptCard({
  _id,
  category,
  title,
  prompt,
  image,
  likes = 0,
  copyCount = 0,
  views = 0,
  onClick,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopied(true);

    if (_id) {
      try {
        await fetch(`/api/prompts/${_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "incrementCopyCount" }),
        });
      } catch (err) {
        console.error("❌ Failed to update copy count", err);
      }
    }

    setTimeout(() => setCopied(false), 2000);
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
      console.error("❌ Failed to toggle like", err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    const shareUrl = `${window.location.origin}/prompt/${_id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("🔗 Link copied to clipboard!");
    } catch (err) {
      console.error("❌ Share failed", err);
    }
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="flex flex-col md:flex-row items-start gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-lime-500/20 transition-all duration-300 cursor-pointer"
    >
      {/* 🖼️ Image with shine */}
      {image && (
        <div className="relative group w-full md:w-40 h-40 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shine" />
        </div>
      )}

      {/* 📄 Content */}
      <div className="flex-1">
        <div className="text-sm text-lime-400 font-medium mb-1">{category}</div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>

        <div title={prompt}>
          <p className="text-gray-300 text-sm mb-4">
            {prompt.length > 95 ? `${prompt.slice(0, 90)}...` : prompt}
          </p>
        </div>

        {/* 🎛️ Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-3">
          {/* 📋 Copy */}
          <div>
            <button
              onClick={handleCopy}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-md transition-all ${
                copied
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
          </div>

          {/* ❤️ & 🔗 Right Aligned */}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-all ${
                isLiked
                  ? "bg-red-500/80 text-white"
                  : "bg-white/10 text-red-300 border border-white/20 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              {likeCount}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}