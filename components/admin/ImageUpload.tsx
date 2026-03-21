"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { X, Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  initialValue?: string;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ initialValue, onUploadSuccess, onRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState(initialValue || "");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return "Max file size is 5MB";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return "Only JPG, PNG and WebP are allowed";
    }
    return null;
  };

  const startUpload = async (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload/presign", { method: "POST" });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { presignedUrl, publicUrl } = await res.json();

      // 2. Upload directly to R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.onload = () => {
          if (xhr.status === 200) resolve();
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // 3. Success
      setPreview(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed. Please try again.";
      console.error(err);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startUpload(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) startUpload(file);
  };

  const handleRemove = () => {
    setPreview("");
    setProgress(0);
    setError("");
    onRemove();
  };

  return (
    <div className="space-y-4 w-full">
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center
          ${preview ? "border-lime-500/50 bg-lime-500/5" : "border-white/10 hover:border-lime-400/50 bg-white/5"}
          ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onClick={() => !preview && !uploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp"
        />

        {preview ? (
          <div className="relative group w-full aspect-video md:aspect-square max-w-[240px] rounded-lg overflow-hidden border border-white/10">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
              sizes="240px"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-lime-400">
              <Upload size={24} />
            </div>
            <p className="text-white font-medium mb-1">Click or drag to upload</p>
            <p className="text-white/40 text-xs">JPG, PNG, WebP (Max 5MB)</p>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-lime-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-lime-400 uppercase tracking-widest">{progress}% Uploading...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {preview && !uploading && (
        <div className="flex items-center gap-2 text-lime-400 text-xs font-medium">
          <CheckCircle2 size={14} />
          <span>R2 Direct Upload Success</span>
        </div>
      )}
    </div>
  );
}
