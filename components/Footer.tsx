"use client";
import { LuArrowUpRight } from "react-icons/lu";
import { FaFacebookF, FaTiktok, FaYoutube, FaInstagram, FaLinkedinIn, FaPinterest } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 backdrop-blur-md bg-transparent text-white border-t border-white/10">
      {/* Top faded line */}
      <div className="h-px bg-white/50 mb-3"></div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto py-10 flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left: Logo + Pages */}
        <div className="flex items-start gap-6">
          {/* ✅ Logo */}
          <Link href="/" className="mb-2">
            <img
              src="/logo.svg" // ⚠️ Make sure your logo.svg is in the /public folder
              alt="PromptHubb Logo"
              className="w-15 h-auto"
            />
          </Link>

          {/* ✅ Navigation Links */}
          <div className="space-x-5">
            <Link href="/about" className="text-white/70 hover:text-white transition">About Us</Link>
            <Link href="#" className="text-white/70 hover:text-white transition">What’s New</Link>
            <Link href="#" className="text-white/70 hover:text-white transition">Pricing</Link>
            <Link href="#" className="text-white/70 hover:text-white transition">Help</Link>
          </div>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-6 text-white/70">
          <a href="https://www.facebook.com/share/19pDrf2car/?mibextid=wwXIfr" className="hover:text-lime-400 transition">
            <FaFacebookF size={22} />
          </a>
          <a href="https://www.pinterest.com/promptlime/" className="hover:text-lime-400 transition">
            <FaPinterest size={20} />
          </a>
          <a href="https://www.linkedin.com/company/promptlime-ai/" className="hover:text-lime-400 transition">
            <FaLinkedinIn size={22} />
          </a>
          <a href="https://www.instagram.com/promptlime.ai" className="hover:text-lime-400 transition">
            <FaInstagram size={22} />
          </a>
        </div>
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
    </footer>
  );
}