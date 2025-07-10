"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copiesLeft, setCopiesLeft] = useState<number | null>(null);
  const dropdownRef = useRef(null);

  const { data: session } = useSession();
  const isPro = (session?.user as any)?.isPro;

  useEffect(() => {
    const fetchCopyCount = async () => {
      if (!session?.user || isPro) return;
      try {
        const res = await fetch("/api/user/copy-count");
        const data = await res.json();
        const left = 5 - (data.copyCount || 0);
        setCopiesLeft(left < 0 ? 0 : left);
      } catch (error) {
        console.error("Failed to fetch copy count", error);
      }
    };
    fetchCopyCount();
  }, [session, isPro]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] backdrop-blur-md bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 🔰 Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="PromptHubb logo"
            width={130}
            height={30}
            priority
          />
        </Link>

        {/* 🔧 Right Side */}
        <div className="flex items-center gap-5 text-gray-300 relative z-[70]">
          {/* 🔍 Search Input */}
          {showSearch ? (
            <div className="flex items-center gap-2 w-[240px] z-[70]">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="w-full px-4 py-2 text-sm text-white placeholder:text-white/50 rounded-full border border-lime-400 bg-lime-400/10 shadow outline-none focus:ring-2 focus:ring-lime-400"
              />
              <X
                size={20}
                className="cursor-pointer text-white hover:text-lime-400 transition"
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                }}
              />
            </div>
          ) : (
            <div className="relative hidden md:flex group">
              <Search
                size={20}
                className="cursor-pointer hover:text-lime-400 transition"
                onClick={() => setShowSearch(true)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-[150%] text-xs hidden group-hover:flex bg-neutral-900 text-white px-2 py-1 rounded shadow">
                Search
              </div>
            </div>
          )}

          {/* 🔔 Notifications */}
          <div className="relative hidden md:flex group">
            <Bell
              size={20}
              className="hover:text-lime-400 cursor-pointer transition"
            />
            <div className="absolute left-1/2 -translate-x-1/2 top-[150%] text-xs hidden group-hover:flex bg-neutral-900 text-white px-2 py-1 rounded shadow">
              Notifications
            </div>
          </div>

          {/* 📊 Copies Left */}
          {session?.user && (
            <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:block">
              {isPro ? "∞ Unlimited" : `${copiesLeft ?? 5} left`}
            </span>
          )}

          {/* 👤 Auth Section */}
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 text-sm text-white bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 transition"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={18}
                height={18}
                className="rounded-full"
              />
              Login with Google
            </button>
          ) : (
            <div className="relative z-[60]" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`rounded-full border-2 border-transparent ${
                  isPro ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="User"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-neutral-900 text-white rounded-xl shadow-xl z-50 py-2 border border-white/10"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-white hover:bg-lime-500/10 hover:text-lime-400 transition"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}