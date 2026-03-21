"use client";

import { useState } from "react";
import { X, Upload, Check, Loader2 } from "lucide-react";
import SafeImage from "./SafeImage";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is available based on previous work

interface SubmitResultModalProps {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SubmitResultModal({ promptId, promptTitle, onClose, onSuccess }: SubmitResultModalProps) {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentType: file.type,
          folder: "results"
        }),
      });
      const { uploadUrl, publicUrl } = await res.json();

      // 2. Upload to R2
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (type === 'before') setBeforeImage(publicUrl);
      else setAfterImage(publicUrl);
      
      toast.success(`${type === 'before' ? 'Original' : 'Result'} image uploaded!`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!beforeImage || !afterImage) {
      toast.error("Both images are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/submit-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId,
          beforeImage,
          afterImage,
          caption,
        }),
      });

      if (res.ok) {
        toast.success("Result submitted successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Failed to submit result");
      }
    } catch (error) {
       console.error("Submit failed:", error);
       toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold text-white">Submit Your Result</h2>
            <p className="text-sm text-lime-400 font-mono mt-1">Prompt: {promptTitle}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before Image */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Original / Before</label>
              <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 relative overflow-hidden group hover:border-lime-400/50 transition-colors">
                {beforeImage ? (
                  <>
                    <SafeImage src={beforeImage} alt="Before" fill className="object-cover" />
                    <button 
                      onClick={() => setBeforeImage(null)}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white/70 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={24} className="text-white/20 mb-2 group-hover:text-lime-400 transition-colors" />
                    <span className="text-xs text-white/40">Drop or Click</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'before')}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* After Image */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">AI Result / After</label>
              <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 relative overflow-hidden group hover:border-lime-400/50 transition-colors">
                {afterImage ? (
                  <>
                    <SafeImage src={afterImage} alt="After" fill className="object-cover" />
                    <button 
                      onClick={() => setAfterImage(null)}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white/70 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={24} className="text-white/20 mb-2 group-hover:text-lime-400 transition-colors" />
                    <span className="text-xs text-white/40">Drop or Click</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'after')}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Caption (Optional)</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="How did it turn out? Any tips?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-lime-400/50 min-h-[100px] resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading || !beforeImage || !afterImage}
            className="w-full py-4 bg-lime-400 text-black font-bold rounded-2xl hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Check size={20} />
                <span>Submit Result</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
