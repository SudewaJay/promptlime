"use client";

import { useState } from "react";
import NextImage, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export default function SafeImage({ src, alt, fallbackText, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/5 text-white/20 font-bold uppercase ${props.className}`}>
        {fallbackText ? fallbackText.slice(0, 1) : "?"}
      </div>
    );
  }

  return (
    <NextImage
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
