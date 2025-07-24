"use client";

import { useEffect, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import {
  FaFacebookF,
  FaPinterest,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-20 backdrop-blur-md bg-transparent text-white border-t border-white/10 relative">
      {/* Top faded line */}
      <div className="h-px bg-white/50 mb-3" />

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto py-10 flex flex-col md:flex-row justify-between gap-10 text-center md:text-left">
        {/* Left: Logo + Pages */}
        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-auto">
          {/* ✅ Logo */}
          <Link href="/" className="mb-2 block md:hidden">
            <Image
              src="/logo.svg"
              alt="Promptlime Logo"
              width={96}
              height={28}
              priority
            />
          </Link>

          {/* ✅ Navigation Links */}
          <div className="flex flex-col gap-2 md:flex-row md:space-x-5">
            <Link href="/about" className="text-white/70 hover:text-white transition">
              About Us
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition">
              What’s New
            </Link>
            <Link href="/pricing" className="text-white/70 hover:text-white transition">
              Pricing
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition">
              Help
            </Link>
          </div>
        </div>

        {/* Right: Social Icons */}
        <div className="flex justify-center md:justify-end items-center gap-6 text-white/70 w-full md:w-auto">
          <a
            href="https://www.facebook.com/share/19pDrf2car/?mibextid=wwXIfr"
            className="hover:text-lime-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={22} />
          </a>
          <a
            href="https://www.pinterest.com/promptlime/"
            className="hover:text-lime-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPinterest size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/promptlime-ai/"
            className="hover:text-lime-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={22} />
          </a>
          <a
            href="https://www.instagram.com/promptlime.ai"
            className="hover:text-lime-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={22} />
          </a>
        </div>
      </div>

      {/* Payment Security Badges */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <Image
          src="/payment/stripe.svg"
          alt="Stripe payment badge"
          width={40}
          height={16}
          className="opacity-60 hover:opacity-100 transition"
        />
        <Image
          src="/payment/visa.svg"
          alt="Visa payment badge"
          width={40}
          height={16}
          className="opacity-60 hover:opacity-100 transition"
        />
        <Image
          src="/payment/mastercard.svg"
          alt="MasterCard payment badge"
          width={40}
          height={16}
          className="opacity-60 hover:opacity-100 transition"
        />
      </div>

      {/* Bottom Tagline */}
      <div className="text-center py-4">
        <a
          href="https://uniixstudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-orange-500 to-yellow-500 animate-text text-sm font-medium hover:underline"
        >
          Product of Uniix Studio
          <LuArrowUpRight
            size={16}
            className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          />
        </a>
      </div>

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-white text-black rounded-full shadow-lg hover:bg-lime-400 transition z-50"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </footer>
  );
}