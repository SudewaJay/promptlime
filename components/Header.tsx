"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Search } from "lucide-react";
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

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
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

  // 🔔 Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // 🔔 Fetch Notifications
  useEffect(() => {
    if (!user) return;
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    }
    fetchNotifications();
    // Poll every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // 👀 Mark as Read
  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      // Local Update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  // 🛑 Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // User Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Notification Dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showDropdown || showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showNotifications]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] backdrop-blur-md bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* 🔰 Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-[60]">
          <Image
            src="/logo.svg"
            alt="PromptHubb logo"
            width={130}
            height={30}
            priority
          />
        </Link>

        {/* 🔍 Search Bar (Desktop Center) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] z-50">
          <div className="relative w-full shadow-lg shadow-lime-400/5 rounded-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 rounded-full border border-white/10 bg-[#0f0f0f]/50 backdrop-blur-md focus:bg-[#0f0f0f] focus:border-lime-400/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* 🔧 Right Side */}
        <div className="flex items-center gap-5 text-gray-300 relative z-[70]">
          {/* 🔍 Search Bar (Mobile Only) */}
          <div className="md:hidden relative z-50 flex items-center gap-2 w-[160px]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/50 rounded-full border border-white/10 bg-white/5 focus:bg-white/10 focus:border-lime-400/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* 🔔 Notification */}
          <div className="relative" ref={notificationRef}>
            <div
              className="relative cursor-pointer hover:text-lime-400 transition"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                </span>
              )}
            </div>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-3 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-[80] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f0f0f]">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    <span className="text-xs text-gray-400">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleMarkAsRead(n._id, n.isRead)}
                          className={`p-4 border-b border-white/5 cursor-pointer transition hover:bg-white/5 ${!n.isRead ? "bg-lime-400/5" : ""
                            }`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? "bg-lime-400" : "bg-transparent"}`} />
                            <div>
                              <p className={`text-sm ${!n.isRead ? "text-white font-medium" : "text-gray-400"}`}>
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-gray-600 mt-2">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 📊 Copy Count */}
          {user && !isPro && (
            <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:block">
              {copyCount} / 20 copied (Monthly)
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
                className={`rounded-full border-2 border-transparent ${isPro ? "ring-2 ring-yellow-400" : ""
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