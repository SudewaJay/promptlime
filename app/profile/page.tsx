"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { CalendarDays, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SparklesCore } from "@/components/ui/sparkles";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const isPro = user?.isPro;
  const joinedDate = user?.createdAt ? new Date(user.createdAt) : new Date();

  const [loadingStripe, setLoadingStripe] = useState(false);
  const [stats, setStats] = useState({ liked: 0, copied: 0, saved: 0 });

  useEffect(() => {
    if (!user?.email) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        setStats({
          liked: data.likedCount || 0,
          copied: data.copiedCount || 0,
          saved: data.savedCount || 0,
        });
      } catch (err) {
        console.error("❌ Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, [user?.email]);

  const handleStripeCheckout = async () => {
    setLoadingStripe(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to redirect to checkout. Please try again later.");
      }
    } catch (err) {
      console.error("⚠️ Stripe Checkout failed", err);
      alert("An error occurred while starting checkout.");
    } finally {
      setLoadingStripe(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-center space-y-4">
        <p>You need to log in to view your profile.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f]/80 via-[#0f0f0f]/60 to-[#0f0f0f]/0 text-white overflow-hidden">
      {/* ✨ Background Particles */}
      <div className="absolute inset-0 -z-10">
        <SparklesCore
          id="sparkles-profile"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#ffffff"
        />
      </div>

      <Header />

      {/* 🌈 Lime Glow */}
      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 space-y-16">
        {/* 🧑 Profile Info */}
        <section className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="py-4">
              <Image
                src={user?.image || "/default-avatar.png"}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full ring-2 ring-white"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">
                {user?.name || "Anonymous User"}
              </h1>
              {isPro && <Crown size={20} className="text-yellow-400" />}
            </div>

            <p className="text-sm text-white/70">{user?.email || "No email"}</p>
            <p className="flex items-center gap-1 text-sm text-white/50 mt-1">
              <CalendarDays size={16} className="text-white/40" />
              Joined {joinedDate.toDateString()}
            </p>

            {/* 👉 Stripe CTA (fixed) */}
            {!isPro && (
              <HoverBorderGradient
                onClick={handleStripeCheckout}
                className="text-white font-medium text-sm px-6 py-2 mt-4 block text-center cursor-pointer"
              >
                {loadingStripe ? "Redirecting..." : "Upgrade to Pro"}
              </HoverBorderGradient>
            )}
          </div>
        </section>

        {/* 📊 Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl py-6 px-4">
            <h2 className="text-3xl font-bold text-lime-400">{stats.liked}</h2>
            <p className="text-sm text-white/70 mt-2">Prompts Liked</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl py-6 px-4">
            <h2 className="text-3xl font-bold text-lime-400">{stats.copied}</h2>
            <p className="text-sm text-white/70 mt-2">Prompts Copied</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl py-6 px-4">
            <h2 className="text-3xl font-bold text-lime-400">{stats.saved}</h2>
            <p className="text-sm text-white/70 mt-2">Saved Categories</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}