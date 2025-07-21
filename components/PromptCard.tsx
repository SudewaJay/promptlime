"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart, Share2, Clipboard, Check, X } from "lucide-react";
import Image from "next/image";

interface PromptCardProps {
  _id?: string;
  category: string;
  title: string;
  prompt: string;
  image?: string;
  likes?: number;
  onClick?: () => void;
}

export default function PromptCard({
  _id,
  category,
  title,
  prompt,
  image,
  likes = 0,
  onClick,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    try {
      const res = await fetch(`/api/prompts/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      });

      if (res.status === 403) {
        const data = await res.json();
        setModalMessage(data?.error || "Limit reached.");
        setShowModal(true);

        if (session) {
          setTimeout(() => router.push("/pricing"), 2500);
        }

        return;
      }

      if (!res.ok) {
        setModalMessage("❌ Something went wrong.");
        setShowModal(true);
        return;
      }

      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Copy error", err);
      setModalMessage("❌ Failed to copy prompt.");
      setShowModal(true);
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
                Enjoying Our Prompts?
              </h2>
              <p className="text-sm text-gray-300 mb-5">{modalMessage}</p>

              {!session && (
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

      {/* 🧩 Prompt Card */}
      <motion.div
        layout
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="flex flex-col md:flex-row items-start gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-lime-500/20 transition-all duration-300 cursor-pointer"
      >
        {image && (
          <div className="relative group w-full md:w-40 md:h-40 aspect-square md:aspect-auto rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="text-sm text-lime-400 font-medium mb-1">
            {category}
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-sm mb-4">
            {prompt.length > 95 ? `${prompt.slice(0, 90)}...` : prompt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 md:flex-row">
            {/* ❤️ Like */}
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

            {/* 🔗 Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-white/10 text-white hover:text-lime-400 hover:bg-white/20 border border-white/20 transition"
            >
              <Share2 size={16} /> Share
            </button>

            {/* 📋 Copy */}
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
        </div>
      </motion.div>
    </>
  );
}