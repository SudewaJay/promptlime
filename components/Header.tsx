"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isPro?: boolean;
  createdAt?: Date | string;
}

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyCount, setCopyCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;
  const isPro = user?.isPro;

  // 🔁 Fetch user's copied prompts count
  useEffect(() => {
    const fetchCopyCount = async () => {
      if (!user || isPro) return;
      try {
        const res = await fetch("/api/user/copy-count");
        const data = await res.json();
        setCopyCount(data.copyCount || 0);
      } catch (error) {
        console.error("Failed to fetch copy count", error);
      }
    };
    fetchCopyCount();
  }, [user, isPro]);

  // 🛑 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          {/* 🔍 Search */}
          {showSearch ? (
            <div className="relative z-50 flex items-center gap-2 w-[240px]">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="w-full px-4 py-2 text-sm text-white placeholder:text-white/50 rounded-full border border-lime-400 bg-lime-400/10 shadow outline-none focus:ring-2 focus:ring-lime-400 focus:outline-none"
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
            <Search
              size={20}
              className="cursor-pointer hover:text-lime-400 transition hidden md:flex"
              onClick={() => setShowSearch(true)}
            />
          )}

          {/* 🔔 Notification */}
          <Bell
            size={20}
            className="hover:text-lime-400 cursor-pointer transition hidden md:flex"
          />

          {/* 📊 Copy Count */}
          {user && !isPro && (
            <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:block">
              {copyCount} / 5 copied
            </span>
          )}
          {user && isPro && (
            <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:block">
              ∞ Unlimited
            </span>
          )}

          {/* 👤 Auth Section */}
          {!user ? (
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
                  src={user.image || "/default-avatar.png"}
                  alt="User"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </button>

              {/* 🔽 Dropdown */}
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
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
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