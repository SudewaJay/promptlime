"use client";

import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { Crown, Loader2 } from "lucide-react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <HoverBorderGradient
      onClick={handleStripeCheckout}
      className="text-white font-bold text-sm px-8 py-3 flex items-center gap-2 cursor-pointer shadow-lg shadow-lime-400/5 group"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Crown size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
      )}
      <span>{loading ? "Redirecting..." : "Upgrade to Pro"}</span>
    </HoverBorderGradient>
  );
}
