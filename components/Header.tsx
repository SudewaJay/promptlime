"use client";

import { useState } from "react";
import { Bell, Search, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-transparent border-b border-white/10">
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

        {/* 🔔 Right-side Icons & Actions */}
        <div className="flex items-center gap-5 text-gray-300">
          {/* 🔍 Search */}
          {showSearch ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
              />
              <X
                size={20}
                aria-label="Close search"
                className="cursor-pointer hover:text-lime-400 transition"
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                }}
              />
            </div>
          ) : (
            <Search
              size={20}
              aria-label="Search prompts"
              className="cursor-pointer hover:text-lime-400 transition"
              onClick={() => setShowSearch(true)}
            />
          )}

          {/* 🔔 Notifications */}
          <Bell size={20} aria-label="Notifications" className="hover:text-lime-400 cursor-pointer transition" />

          {/* 👤 Auth Buttons */}
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="text-sm text-white/80 hover:text-lime-400 transition"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm truncate max-w-[120px]">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-white/60 hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* 📝 Submit Link */}
          <Link
            href="/submit"
            className="ml-2 text-sm text-white/80 hover:text-lime-400 transition font-medium"
          >
            Submit
          </Link>
        </div>
      </div>
    </header>
  );
}