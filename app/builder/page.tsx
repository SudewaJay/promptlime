"use client";

import { useState, useEffect } from "react";
import { Copy, RotateCcw, Wand2, Check, Camera, Lightbulb, Image as ImageIcon, Map, Sparkles, Wand, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import copy from "copy-to-clipboard";

import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = {
  mood: ["None", "Joyful", "Dramatic", "Mysterious", "Serene", "Energetic", "Dark", "Romantic"],
  style: ["None", "Cinematic", "Photorealistic", "Anime", "Illustration", "Watercolor", "3D Render", "Vintage"],
  subject: ["None", "Person", "Animal", "Object", "Landscape", "Architecture", "Abstract"],
  setting: ["None", "Urban", "Nature", "Cyberpunk City", "Studio", "Underwater", "Space", "Desert"],
  camera: ["None", "35mm", "85mm", "Wide Angle", "Macro", "Fisheye"],
  lighting: ["None", "Natural", "Golden Hour", "Neon", "Soft Box", "Dramatic", "Backlit"],
  aspectRatio: ["Square (1:1)", "Landscape (16:9)", "Portrait (3:4)", "Widescreen (21:9)"],
};

export default function BuilderPage() {

  const [platform, setPlatform] = useState("ChatGPT");
  const [subject, setSubject] = useState("None");
  const [style, setStyle] = useState("None");
  const [setting, setSetting] = useState("None");
  const [lighting, setLighting] = useState("None");
  const [camera, setCamera] = useState("None");
  const [mood, setMood] = useState("None");
  const [aspectRatio, setAspectRatio] = useState("Square (1:1)");

  const [promptText, setPromptText] = useState("");
  const [copied, setCopied] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Auto-generate prompt logic
  useEffect(() => {
    // Step 1: Base command
    const base = platform === "ChatGPT" ? "Create an image of" : "A high quality image of";

    // Step 2: Core description
    const coreParts = [];
    if (mood && mood !== "None") coreParts.push(mood.toLowerCase());
    if (style && style !== "None") coreParts.push(style.toLowerCase());
    if (subject && subject !== "None") {
      coreParts.push(subject.toLowerCase());
    } else {
      coreParts.push("subject"); // default
    }

    let result = `${base} ${coreParts.join(" ")}`;

    // Step 3: Append environment + technicals
    const techParts = [];
    if (setting && setting !== "None") techParts.push(`in a ${setting.toLowerCase()} setting`);
    if (camera && camera !== "None") techParts.push(`shot on ${camera.toLowerCase()} lens`);
    if (lighting && lighting !== "None") techParts.push(`with ${lighting.toLowerCase()} lighting`);

    if (techParts.length > 0) {
      result += `, ${techParts.join(", ")}.`;
    } else {
      result += ".";
    }

    // Step 4: Aspect Ratio
    if (aspectRatio) {
      if (platform === "ChatGPT") {
        const arText = aspectRatio === "Square (1:1)" ? "square 1:1"
          : aspectRatio === "Landscape (16:9)" ? "landscape 16:9"
          : aspectRatio === "Portrait (3:4)" ? "vertical 3:4"
          : "widescreen 21:9";
        result += ` Make it a ${arText} aspect ratio.`;
      } else {
        result += ` Aspect ratio: ${aspectRatio}.`;
      }
    }

    // Step 5: Person edge case
    if (subject === "Person") {
      result = "Use the uploaded photo as the main subject. Keep the exact face.\n\n" + result;
    }

    setPromptText(result.trim());
  }, [platform, subject, style, setting, lighting, camera, mood, aspectRatio]);

  const handleCopy = () => {
    copy(promptText);
    setCopied(true);
    toast.success("Prompt copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenIn = () => {
    // 2-step Interstitial flow
    handleCopy();
    setShowModal(true);
  };

  const handleDeepLink = () => {
    const encoded = encodeURIComponent(promptText);
    const url = platform === "ChatGPT"
      ? `https://chat.openai.com/?q=${encoded}`
      : `https://gemini.google.com/app?q=${encoded}`;
    
    window.open(url, "_blank");
    setShowModal(false);
  };

  const handleReset = () => {
    setSubject("None");
    setStyle("None");
    setSetting("None");
    setLighting("None");
    setCamera("None");
    setMood("None");
    setAspectRatio("Square (1:1)");
    toast("Reset all fields", { icon: "🔄" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0f0f] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-br from-lime-400/10 via-transparent to-transparent opacity-40 blur-3xl -z-10 pointer-events-none" />
      <Header />

      {/* 🚀 Interstitial Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-3xl p-10 text-center relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={24} /></button>
              
              <div className="inline-flex items-center gap-2 bg-lime-400/10 text-lime-400 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
                <Check size={16} /> Prompt Copied
              </div>

              <h2 className="text-3xl font-black text-white mb-4">Ready to generate?</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Open {platform}, paste your prompt with <kbd className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-sm mx-1">⌘V</kbd>, add your photo and hit send.
              </p>

              <button 
                onClick={handleDeepLink} 
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-lime-400 transition-colors shadow-lg"
              >
                Open {platform} &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-white/10 pb-8 relative"
        >
          <div className="flex items-center gap-3 text-lime-400 mb-4">
            <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Wand size={32} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
              Prompt Builder
            </h1>
          </div>
          <p className="text-white/60 text-lg max-w-2xl font-light">
            Construct perfect AI image prompts visually. Designed for precision on ChatGPT (DALL-E) and Google Gemini.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row gap-10"
        >
          
          {/* LEFT PANEL: Controls */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 space-y-8">
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-md shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-lime-400" /> Elements
                </h2>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setPlatform("ChatGPT")}
                    className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${platform === "ChatGPT" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    {platform === "ChatGPT" && <motion.div layoutId="platform-bg" className="absolute inset-0 bg-lime-400/20 border border-lime-400/30 rounded-lg -z-10" />}
                    ChatGPT
                  </button>
                  <button
                    onClick={() => setPlatform("Gemini")}
                    className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${platform === "Gemini" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    {platform === "Gemini" && <motion.div layoutId="platform-bg" className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-lg -z-10" />}
                    Gemini
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                
                <div className="flex flex-col gap-2 group/input">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
                    <ImageIcon size={12} /> Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/30 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.subject.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2 group/input">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
                    <Wand2 size={12} /> Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.style.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
                    <Map size={12} /> Setting
                  </label>
                  <select
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.setting.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
                    <Lightbulb size={12} /> Lighting
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.lighting.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-1.5">
                    <Camera size={12} /> Camera Lens
                  </label>
                  <select
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.camera.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {OPTIONS.mood.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
               </div>

                <div className="flex flex-col gap-3 sm:col-span-2 mt-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50">Aspect Ratio</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
                    {OPTIONS.aspectRatio.map(val => (
                       <button
                         key={val}
                         onClick={() => setAspectRatio(val)}
                         className={`relative py-2 text-xs md:text-[10px] lg:text-xs font-medium rounded-lg transition-all ${aspectRatio === val ? "text-lime-400" : "text-white/60 hover:text-white"}`}
                       >
                         {aspectRatio === val && <motion.div layoutId="ar-bg" className="absolute inset-0 bg-lime-400/10 rounded-lg -z-10" />}
                         {val.split(' ')[0]}
                       </button>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end relative z-10">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors uppercase tracking-wider group"
                >
                  <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform duration-300" />
                  Reset Form
                </button>
              </div>

            </div>
          </motion.div>

          {/* RIGHT PANEL: Output */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2 mb-2">
               <div className="flex items-center gap-2">
                 <div className="h-6 w-1 bg-lime-400 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                 <h2 className="text-xl font-bold text-white">Live Preview</h2>
               </div>
               <span className="text-white/40 text-xs tracking-widest font-mono">
                 {promptText.length} CHARS
               </span>
            </div>
            
            <motion.div 
               layout
               className="bg-[#121212] border border-white/10 rounded-3xl p-6 md:p-8 relative group min-h-[220px] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none" />
               <AnimatePresence mode="popLayout">
                 <motion.p 
                   key={promptText}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="text-lg md:text-2xl text-white/90 leading-relaxed font-light whitespace-pre-wrap relative z-10"
                 >
                   {promptText}
                 </motion.p>
               </AnimatePresence>

               {/* Hint for Person Subject */}
               <AnimatePresence>
                 {subject === "Person" && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="absolute top-4 right-4 bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs px-3 py-1 rounded-full flex items-center gap-1.5"
                   >
                     <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                     Face consistency enabled
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>

            {/* Actions Grid */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
               {/* Primary CTA */}
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleCopy}
                 className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl border border-white/10 transition-colors"
               >
                 {copied ? <Check size={20} className="text-lime-400" /> : <Copy size={20} />}
                 {copied ? "Copied!" : "Copy Prompt"}
               </motion.button>

               {/* Secondary CTA */}
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleOpenIn}
                 className="flex-1 flex items-center justify-center gap-2 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-2xl transition-colors shadow-[0_0_20px_rgba(163,230,53,0.2)]"
               >
                 Open in {platform} &rarr;
               </motion.button>
            </div>
            <p className="text-center text-xs text-white/30 hidden sm:block">
              Save prompts logic integrated into the Open In modal to minimize friction.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
