"use client";

import { motion } from "framer-motion";

export default function AnimatedCTA() {
  return (
    <section className="relative w-full py-10 overflow-hidden bg-black mt-24">
      {/* 🌈 Gradient Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-gradient-to-r from-blue-400/20 via-blue-500/30 to-blue-400/20 blur-3xl animate-pulse"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Discover more AI prompts
        </h2>
        <p className="text-white/70 mb-8 text-base">
          Browse through all available prompts to find your inspiration.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-lime-400 hover:bg-lime-300 text-black text-sm font-semibold transition shadow-md hover:shadow-lg"
        >
          View All Prompts →
        </a>
      </div>
    </section>
  );
}