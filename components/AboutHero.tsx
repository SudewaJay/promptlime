"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedTooltipPreview } from "@/components/AnimatedTooltipPreview";


export default function AboutHero() {
  return (
    <section className="relative flex h-[40rem] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
      {/* ✨ Grid Lines Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* 🔦 Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />

      {/* 📝 Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-16 md:pt-0">
        <h1 className="text-center text-3xl md:text-7xl font-bold text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text">
          About Promptlime
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-l text-neutral-300">
          We’re building the world’s best curated prompt marketplace. Our goal is to help creators, marketers, and developers find the perfect starting point using the power of AI.
        </p>
      </div>

    </section>
    
  );
}