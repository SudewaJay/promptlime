"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clipboard, Heart, Share2 } from "lucide-react";
import copy from "copy-to-clipboard";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
    _id: string;
    title: string;
    category: string;
    prompt: string;
    image?: string;
    createdAt: string;
    author?: { name?: string; image?: string };
    likes?: number;
    tags?: string[];
  };
}

export default function PromptModal({ isOpen, onClose, prompt }: PromptModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleCopy = () => {
    copy(prompt.prompt);
    // You can replace this with a toast message
    console.log("📋 Prompt copied!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#121212] max-w-2xl w-full rounded-xl p-6 text-white shadow-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ❌ Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-red-500"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>

          {/* 📝 Title + Category */}
          <h2 className="text-2xl font-bold mb-1">{prompt.title}</h2>
          <div className="text-sm text-lime-400 mb-3">{prompt.category}</div>

          {/* 🖼️ Optional Image */}
          {prompt.image && (
            <Image
              src={prompt.image}
              alt={prompt.title}
              width={800}
              height={400}
              className="rounded-xl mb-4 w-full object-cover max-h-[300px]"
            />
          )}

          {/* 📋 Prompt Text */}
          <pre className="whitespace-pre-wrap text-gray-300 mb-4 text-sm bg-white/5 p-4 rounded-xl">
            {prompt.prompt}
          </pre>

          {/* 👤 Author + Date */}
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            {prompt.author?.image && (
              <Image
                src={prompt.author.image}
                alt={prompt.author.name || "User Avatar"}
                width={30}
                height={30}
                className="rounded-full"
              />
            )}
            <span>{prompt.author?.name || "Anonymous"}</span>
            <span>·</span>
            <span>{dayjs(prompt.createdAt).fromNow()}</span>
          </div>

          {/* 💬 Tags */}
          {(prompt.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              {prompt.tags!.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 px-2 py-1 rounded-full text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ⚙️ Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button onClick={handleCopy} className="hover:text-lime-400 flex items-center gap-1">
                <Clipboard size={18} /> Copy
              </button>
              <button className="hover:text-pink-400 flex items-center gap-1">
                <Heart size={18} /> {prompt.likes || 0}
              </button>
            </div>
            <div className="flex gap-3">
              <Share2
                size={18}
                className="hover:text-blue-400 cursor-pointer"
                aria-label="Share"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}