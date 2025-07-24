"use client";

import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative px-6">
      
      {/* 🌈 Lime Blur Background */}
      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      {/* ✨ Title */}
      <h1 className="md:text-7xl text-4xl lg:text-7xl font-semibold text-center text-white relative z-20 mb-8">
        Promptlime Coming Soon
      </h1>
      
      {/* 🌌 Sparkles & Gradients */}
      <div className="relative w-full max-w-4xl h-40">
        {/* Gradient Lines */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-green-400 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-green-400 to-transparent h-px w-1/4" />

        {/* Sparkles */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Mask */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

      {/* 👇 Footer Info */}
      <div className="text-center py-4">
        <a
          href="https://uniixstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-orange-500 to-yellow-500 animate-text text-sm font-medium hover:underline"
        >
          Product of Uniix Studio
        </a>
      </div>
    </div>
  );
}