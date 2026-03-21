"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Instagram, Facebook, Twitter, Phone as WhatsApp } from "lucide-react";
import { useState } from "react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareText: string;
}

export default function ShareSheet({
  isOpen,
  onClose,
  shareUrl,
  shareText,
}: ShareSheetProps) {
  const [copyBtnText, setCopyBtnText] = useState("Copy Link");
  const [instagramMessage, setInstagramMessage] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyBtnText("Copied!");
      setTimeout(() => setCopyBtnText("Copy Link"), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareUrl);
    setInstagramMessage("Link copied — paste it in your Instagram story or bio.");
    setTimeout(() => setInstagramMessage(null), 4000);
  };

  const platforms = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <WhatsApp size={24} className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: "hover:bg-green-500/10",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={24} className="text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600/10",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: <Twitter size={24} className="text-white" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-white/10",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={24} className="text-pink-500" />,
      onClick: handleInstagram,
      color: "hover:bg-pink-500/10",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[101] max-w-2xl mx-auto bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-sans">Share Prompt</h3>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={platform.onClick}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 transition-all ${platform.color} group active:scale-95 cursor-pointer`}
                >
                  <div className="mb-2 transition-transform group-hover:scale-110">
                    {platform.icon}
                  </div>
                  <span className="text-xs font-medium text-white/80">{platform.name}</span>
                </a>
              ))}
            </div>

            {/* Instagram Helper Message */}
            <AnimatePresence>
              {instagramMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-4 p-3 bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs text-center rounded-xl"
                >
                  {instagramMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Copy Link Section */}
            <div className="flex items-center gap-3 p-2 pl-4 bg-black/40 border border-white/10 rounded-2xl">
              <span className="text-sm text-white/40 truncate flex-1 font-mono">
                {shareUrl}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  copyBtnText === "Copied!" 
                    ? "bg-green-500 text-white" 
                    : "bg-lime-400 text-black hover:bg-lime-300"
                }`}
              >
                {copyBtnText === "Copied!" ? <Check size={16} /> : <Copy size={16} />}
                {copyBtnText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
