"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SparklesCore } from "@/components/ui/sparkles";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error("❌ Stripe checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f]/80 via-[#0f0f0f]/60 to-[#0f0f0f]/0 text-white overflow-hidden">
      {/* ✨ Background sparkles */}
      <div className="absolute inset-0 -z-10">
        <SparklesCore
          id="sparkles-pricing"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#ffffff"
        />
      </div>

      {/* 🌈 Lime glow top */}
      <div className="fixed top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-lime-400/40 to-transparent blur-3xl z-0 pointer-events-none" />

      {/* 🧭 Header */}
      <Header />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-10">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-lg text-white/70 max-w-lg">
          Upgrade to <span className="text-lime-400">Pro</span> for lifetime access to all prompts,
          unlimited copy actions, and future feature updates.
        </p>

        {/* 💳 Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-md backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-2">Lifetime Pro Access</h2>
          <p className="text-sm text-white/60 mb-4">One-time payment, no recurring fees.</p>
          <p className="text-4xl font-bold text-lime-400 mb-8">$19.99</p>

          <HoverBorderGradient
            as="button"
            type="button"
            onClick={handleStripeCheckout}
            className="text-white font-medium text-sm px-6 py-2 w-full"
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Upgrade Now"}
          </HoverBorderGradient>
        </div>
      </main>

      {/* 🧭 Footer */}
      <Footer />
    </div>
  );
}