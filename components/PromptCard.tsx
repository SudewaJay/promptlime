"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Clipboard, Check, X, Flag } from "lucide-react";
import NextImage from "next/image";
import ShareSheet from "./ShareSheet";
import slugify from "slugify";
import { getImageUrl } from "@/lib/r2";
import SafeImage from "./SafeImage";

interface PromptCardProps {
  _id?: string;
  category: string;
  tool?: string;
  title: string;
  prompt: string;
  image?: string;
  slug?: string;
  priority?: boolean;
  isSavedInitial?: boolean;
  onClick?: () => void;
}

export default function PromptCard({
  _id,
  category,
  tool,
  title,
  prompt,
  image,
  slug,
  isSavedInitial = false,
  onClick,
}: PromptCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [showInterstitialModal, setShowInterstitialModal] = useState(false);

  const isGemini = (tool || category || "").toLowerCase().includes("gemini");
  const platformName = isGemini ? "Gemini" : "ChatGPT";
  const platformUrl = isGemini ? "https://gemini.google.com/" : "https://chat.openai.com/";

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      signIn("google");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/save-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: _id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.isSaved);
      }
    } catch (error: unknown) { // Cleanup status API catch
      console.error("Failed to save prompt:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Clipboard error", err);
      setModalMessage("❌ Failed to copy to clipboard. Please copy manually.");
      setShowModal(true);
      return;
    }

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
        return;
      }
    } catch (err) {
      console.error("❌ Tracker error", err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;

    const finalSlug = slug || slugify(title, { lower: true, strict: true });
    const shareUrl = `${window.location.origin}/p/${finalSlug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — PromptLime`,
          text: `Check out this AI image prompt: ${title}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Native share failed", err);
      }
    }

    setShowShareSheet(true);
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
      fetch(`/api/prompts/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementCopyCount" }),
      }).catch(console.error);

      setShowInterstitialModal(true);
    } catch (err) {
      console.error("❌ Clipboard error", err);
      setModalMessage("❌ Failed to copy to clipboard.");
      setShowModal(true);
    }
  };

  return (
    <>
      {/* 🌟 Modal Notifications */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-[#1a1a1a] border border-white/10 text-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-lime-400 mb-2">Notification</h2>
            <p className="text-sm text-gray-300 mb-6">{modalMessage}</p>
            {!session && modalMessage.toLowerCase().includes("limit") && (
              <button
                onClick={() => signIn("google")}
                className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-4 py-2.5 rounded-full hover:bg-gray-100 w-full transition"
              >
                <NextImage src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                Login with Google
              </button>
            )}
            <button onClick={() => setShowModal(false)} className="mt-4 text-white/40 hover:text-white text-sm">Close</button>
          </motion.div>
        </div>
      )}

      {/* 🚨 Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md flex items-center justify-center px-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Report Prompt</h3>
            <div className="space-y-2 mb-6">
              {["Inappropriate Content", "Spam / Misleading", "Not Working", "Other"].map((r) => (
                <label key={r} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition text-sm">
                  <input type="radio" name="reportReason" value={r} checked={reportReason === r} onChange={(e) => setReportReason(e.target.value)} className="accent-lime-400" />
                  {r}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReportModal(false)} className="text-white/60 hover:text-white text-sm px-3">Cancel</button>
              <button onClick={handleReport} disabled={!reportReason || isReporting} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Interstitial Modal */}
      <AnimatePresence>
        {showInterstitialModal && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center px-4" onClick={() => setShowInterstitialModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-3xl p-10 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowInterstitialModal(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={24} /></button>
              
              <div className="inline-flex items-center gap-2 bg-lime-400/10 text-lime-400 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
                <Check size={16} /> Prompt Copied
              </div>

              <h2 className="text-3xl font-black text-white mb-4">Ready to generate?</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Open {platformName}, paste your prompt with <kbd className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-sm mx-1">⌘V</kbd>, add your photo and hit send.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => { window.open(platformUrl, '_blank'); setShowInterstitialModal(false); }} className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-lime-400 transition-colors">
                  Open {platformName} &rarr;
                </button>
                <button onClick={toggleSave} disabled={isSaving} className={`flex-1 py-4 rounded-2xl font-black border transition-all ${isSaved ? "bg-lime-400/10 border-lime-400/20 text-lime-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
                  {isSaved ? "Saved to Profile" : "Save to Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🧩 Prompt Card Item */}
      <motion.div
        layout
        whileHover={{ y: -4 }}
        onClick={onClick}
        className="flex flex-row items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:shadow-2xl hover:shadow-lime-400/5 transition-all group cursor-pointer"
      >
        {image && (
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden shrink-0 border border-white/5">
            <SafeImage src={getImageUrl(image, 400)} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button onClick={toggleSave} className={`p-2 rounded-lg backdrop-blur-md border ${isSaved ? "bg-lime-400 border-lime-400 text-black" : "bg-black/60 border-white/20 text-white hover:bg-lime-400 hover:text-black"}`}>
                 <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
               </button>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-lime-400 font-black uppercase tracking-[0.2em] mb-1 opacity-60">{tool || "ChatGPT"}</div>
          <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{title}</h2>
          <p className="text-white/40 text-xs line-clamp-2 leading-relaxed mb-4">{prompt}</p>

          <div className="flex items-center gap-3">
             <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${copied ? "bg-lime-400 text-black" : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/5"}`}>
               {copied ? <Check size={14} /> : <Clipboard size={14} />}
               {copied ? "Copied" : "Copy"}
             </button>
             
             <button onClick={handleShare} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
               <Share2 size={16} />
             </button>

             <button onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }} className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-red-400 transition-colors ml-auto">
               <Flag size={14} />
             </button>

             <button onClick={handleOpenPlatform} className="ml-auto text-[10px] text-white/40 hover:text-lime-400 font-bold uppercase tracking-widest transition-colors hidden sm:block">
               Open {platformName} &rarr;
             </button>
          </div>
        </div>
      </motion.div>

      <ShareSheet isOpen={showShareSheet} onClose={() => setShowShareSheet(false)} shareUrl={`${window.location.origin}/p/${slug || slugify(title, { lower: true, strict: true })}`} shareText={`Check out this AI image prompt: ${title}`} />
    </>
  );
}