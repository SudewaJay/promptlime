"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function LoginPromptModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-20 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 max-w-3xl w-full"
      >
        {/* Gradient Glow */}
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] lg:-translate-x-1/2"
        >
          <circle
            r={512}
            cx={512}
            cy={512}
            fill="url(#glowGradient)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="glowGradient">
              <stop stopColor="#84f49d" />
              <stop offset={1} stopColor="#22c55e" />
            </radialGradient>
          </defs>
        </svg>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Content */}
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-lime-400 sm:text-4xl">
            Enjoying Our Prompts?
          </h2>
          <p className="mt-6 text-md leading-6 text-gray-300">
            To continue copying and discovering more creative prompts, please log in.
            As a member, you'll get <strong className="text-white">4 more free copies</strong> today!
          </p>

          <div className="mt-8 flex items-center justify-center lg:justify-start">
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>
          </div>
        </div>

        {/* Right side image */}
        <div className="relative mt-16 h-60 w-full hidden lg:block lg:mt-8">
          <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            alt="Example preview"
            className="absolute top-0 left-0 w-[300px] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
          />
        </div>
      </motion.div>
    </div>
  );
}