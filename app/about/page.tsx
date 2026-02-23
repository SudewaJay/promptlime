"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const useInView = (threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
      {children}
    </div>
  );
};

const GlowOrb = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} style={style} />
);

export default function AboutPage() {

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Syne:wght@700;800&display=swap');
        .lime { color: #c8f135; }
        .lime-bg { background: #c8f135; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
        .card:hover { border-color: rgba(200,241,53,0.3); transform: translateY(-4px); transition: all 0.3s ease; }
        .tag { background: rgba(200,241,53,0.1); border: 1px solid rgba(200,241,53,0.25); color: #c8f135; border-radius: 100px; padding: 4px 14px; font-size: 13px; display: inline-block; }
        .btn-primary { background: #c8f135; color: #0a0a0f; border-radius: 100px; font-weight: 600; padding: 14px 32px; border: none; cursor: pointer; font-size: 15px; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #d9f55a; transform: scale(1.03); }
        .btn-ghost { background: transparent; color: #c8f135; border: 1px solid rgba(200,241,53,0.4); border-radius: 100px; font-weight: 500; padding: 14px 32px; cursor: pointer; font-size: 15px; transition: all 0.2s ease; }
        .btn-ghost:hover { background: rgba(200,241,53,0.1); }
        .nav-blur { backdrop-filter: blur(20px); background: rgba(10,10,15,0.8); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(44px, 7vw, 60px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(30px, 4vw, 48px); font-weight: 700; letter-spacing: -1px; line-height: 1.1; }
        .divider { width: 40px; height: 3px; background: #c8f135; border-radius: 2px; }
        .noise { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.025; z-index: 100; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
        .pill-row { display: flex; flex-wrap: wrap; gap: 10px; }
      `}</style>
      <div className="noise" />

      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 100, position: "relative", maxWidth: 1200, margin: "0 auto", padding: "160px 24px 100px" }}>
        <GlowOrb className="w-96 h-96 bg-lime-400" style={{ top: -100, right: -100, background: "#c8f135", width: 400, height: 400, position: "absolute" }} />
        <div style={{ position: "absolute", top: 0, right: -100, width: 400, height: 400, borderRadius: "50%", background: "#c8f135", filter: "blur(120px)", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800 }}>
          <Reveal>
            <span className="tag" style={{ marginBottom: 24, display: "inline-block" }}>🍋 About PromptLime</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-title" style={{ marginBottom: 24 }}>
              Powering Creativity<br />
              <span className="lime">Through Better</span><br />
              Prompts
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(232,232,240,0.65)", lineHeight: 1.7, maxWidth: 580, marginBottom: 40 }}>
              PromptLime is a curated AI image prompt hub built to help creators, designers, and marketers generate stunning visuals effortlessly — using ChatGPT and Gemini.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/"><button className="btn-primary">🚀 Explore Prompts</button></Link>
              <button className="btn-ghost">Our Mission ↓</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "40px 24px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40 }}>
          {[
            { num: "500+", label: "Curated Prompts" },
            { num: "2", label: "AI Platforms Supported" },
            { num: "100%", label: "Copy-Ready" },
            { num: "Free", label: "Always" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#c8f135", marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "rgba(232,232,240,0.5)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <div>
              <div className="divider" style={{ marginBottom: 20 }} />
              <h2 className="section-title" style={{ marginBottom: 24 }}>Who We<br /><span className="lime">Are</span></h2>
              <p style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.8, marginBottom: 20, fontSize: 16 }}>
                PromptLime is a next-generation prompt discovery platform designed for the modern AI creator.
              </p>
              <p style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.8, marginBottom: 20, fontSize: 16 }}>
                We recognized a simple problem: most users struggle to write high-quality prompts that generate professional-level AI images. The gap between imagination and output is almost always the prompt itself.
              </p>
              <p style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.8, fontSize: 16 }}>
                So we built PromptLime — a centralized, curated hub where you can discover high-performing prompts, copy them in one click, and generate studio-quality visuals in seconds.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "🔍", title: "Discover", desc: "Browse hand-picked, high-performing image prompts across dozens of categories." },
                { icon: "📋", title: "Copy", desc: "One-click copy. No signup needed. No friction between you and your vision." },
                { icon: "✨", title: "Generate", desc: "Paste directly into ChatGPT or Gemini and watch your vision come to life." },
                { icon: "🎯", title: "Optimized", desc: "Every prompt is tested and refined for maximum output quality across platforms." },
              ].map((c, i) => (
                <div key={i} className="card" style={{ padding: 24, transition: "all 0.3s ease" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(232,232,240,0.55)", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ background: "rgba(200,241,53,0.04)", borderTop: "1px solid rgba(200,241,53,0.1)", borderBottom: "1px solid rgba(200,241,53,0.1)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "#c8f135", filter: "blur(150px)", opacity: 0.06, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <span className="tag" style={{ marginBottom: 24, display: "inline-block" }}>Our Mission</span>
            <h2 className="section-title" style={{ marginBottom: 32 }}>
              Making AI Creativity<br /><span className="lime">Accessible to Everyone</span>
            </h2>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(232,232,240,0.65)", lineHeight: 1.8, marginBottom: 48 }}>
              To make advanced AI image generation accessible to everyone — without requiring technical prompt engineering skills.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { text: "Creativity should not be limited by wording" },
                { text: "AI tools should empower, not overwhelm" },
                { text: "Great prompts unlock extraordinary visuals" },
              ].map((b, i) => (
                <div key={i} className="card" style={{ padding: "20px 24px", borderColor: "rgba(200,241,53,0.15)" }}>
                  <div className="lime" style={{ fontSize: 20, marginBottom: 8 }}>✦</div>
                  <p style={{ fontSize: 14, color: "rgba(232,232,240,0.7)", lineHeight: 1.6 }}>{b.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY PROMPTLIME */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="divider" style={{ margin: "0 auto 20px" }} />
            <h2 className="section-title" style={{ marginBottom: 16 }}>Why <span className="lime">PromptLime?</span></h2>
            <p style={{ color: "rgba(232,232,240,0.55)", fontSize: 16 }}>Everything you need to generate better AI images, faster.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { icon: "⚗️", title: "Curated Quality", desc: "Every prompt is refined for clarity, structure, and high-output consistency. No random prompts — only what works." },
            { icon: "🔗", title: "Platform Optimized", desc: "Prompts are structured to work seamlessly with ChatGPT image generation and Google Gemini out of the box." },
            { icon: "🎨", title: "Creator-Focused", desc: "Built specifically for designers, social media creators, brand marketers, and content creators who need results fast." },
            { icon: "⚡", title: "Copy & Generate", desc: "No complex setup. No learning curve. Just copy → paste → generate. That's the PromptLime promise." },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="card" style={{ padding: 32, height: "100%", transition: "all 0.3s ease" }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{c.icon}</div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(232,232,240,0.6)", lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <div>
              <div className="divider" style={{ marginBottom: 20 }} />
              <h2 className="section-title" style={{ marginBottom: 24 }}>Built with<br /><span className="lime">Modern Tech</span></h2>
              <p style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
                PromptLime is built using a modern web stack to ensure performance, scalability, and a seamless creative experience — from first load to final prompt.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "⚛️", name: "React.js", desc: "Dynamic and fast component-based UI" },
                  { icon: "🎨", name: "Tailwind CSS", desc: "Clean, responsive, utility-first design" },
                  { icon: "🌑", name: "Dark-mode First", desc: "Optimized for creative, low-light workflows" },
                  { icon: "📱", name: "Mobile-First", desc: "Seamless experience across all devices" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(232,232,240,0.5)" }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card" style={{ padding: 36, fontFamily: "monospace" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              </div>
              {[
                { c: "rgba(200,241,53,0.5)", t: "// PromptLime Stack" },
                { c: "#c8f135", t: "const stack = {" },
                { c: "rgba(232,232,240,0.6)", t: '  frontend: "React.js",' },
                { c: "rgba(232,232,240,0.6)", t: '  styling: "Tailwind CSS",' },
                { c: "rgba(232,232,240,0.6)", t: '  theme: "dark-first",' },
                { c: "rgba(232,232,240,0.6)", t: '  ux: "copy → paste → done",' },
                { c: "rgba(232,232,240,0.6)", t: '  platforms: ["ChatGPT", "Gemini"],' },
                { c: "#c8f135", t: "};" },
                { c: "", t: "" },
                { c: "rgba(200,241,53,0.5)", t: "// Result: Studio-quality AI images" },
              ].map((l, i) => (
                <div key={i} style={{ color: l.c, fontSize: 13, lineHeight: 2, whiteSpace: "pre" }}>{l.t}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Made For <span className="lime">Creators Like You</span></h2>
            <p style={{ color: "rgba(232,232,240,0.55)", fontSize: 16 }}>If you create visuals, PromptLime is for you.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="pill-row" style={{ justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
            {[
              { e: "🎨", l: "Graphic Designers" },
              { e: "📱", l: "Social Media Managers" },
              { e: "🎥", l: "Content Creators" },
              { e: "🛍️", l: "Brand Marketers" },
              { e: "🧠", l: "AI Enthusiasts" },
              { e: "🚀", l: "Startup Founders" },
              { e: "✏️", l: "Illustrators" },
              { e: "💼", l: "Agencies" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, transition: "all 0.2s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,241,53,0.4)"; e.currentTarget.style.background = "rgba(200,241,53,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                <span>{item.e}</span><span style={{ color: "rgba(232,232,240,0.8)" }}>{item.l}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ background: "rgba(200,241,53,0.03)", borderTop: "1px solid rgba(200,241,53,0.08)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div className="divider" style={{ margin: "0 auto 24px" }} />
            <h2 className="section-title" style={{ marginBottom: 32 }}>Creativity + AI =<br /><span className="lime">Limitless Potential</span></h2>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "rgba(232,232,240,0.65)", lineHeight: 1.9, marginBottom: 24 }}>
              We believe AI is not replacing creativity. It is amplifying it.
            </p>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(232,232,240,0.5)", lineHeight: 1.9 }}>
              The difference between a basic output and a masterpiece<br />often lies in the prompt. <span className="lime" style={{ fontStyle: "italic" }}>PromptLime bridges that gap.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* VISION / ROADMAP */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <Reveal>
            <div>
              <div className="divider" style={{ marginBottom: 20 }} />
              <h2 className="section-title" style={{ marginBottom: 24 }}>The Future of<br /><span className="lime">Prompt Engineering</span></h2>
              <p style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
                PromptLime is more than a prompt directory. We are building the go-to platform for AI-powered creative workflows.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "A global AI prompt marketplace",
                  "Creator-driven prompt sharing",
                  "Premium curated collections",
                  "Industry-specific prompt packs",
                  "AI-enhanced prompt personalization",
                ].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 6, height: 6, background: "#c8f135", borderRadius: "50%", flexShrink: 0 }} />
                    <span style={{ color: "rgba(232,232,240,0.75)", fontSize: 15 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div style={{ color: "rgba(232,232,240,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Coming Soon</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "👤", label: "User Accounts", status: "Soon" },
                  { icon: "🔖", label: "Save Prompts", status: "Soon" },
                  { icon: "📁", label: "Prompt Collections", status: "Soon" },
                  { icon: "📈", label: "Trending Analytics", status: "Planned" },
                  { icon: "👥", label: "Creator Profiles", status: "Planned" },
                  { icon: "⭐", label: "Prompt Rating System", status: "Planned" },
                ].map((r, i) => (
                  <div key={i} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 18 }}>{r.icon}</span>
                      <span style={{ fontSize: 14, color: "rgba(232,232,240,0.8)" }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#c8f135", background: "rgba(200,241,53,0.1)", padding: "3px 10px", borderRadius: 100 }}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(200,241,53,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "#c8f135", filter: "blur(160px)", opacity: 0.08, pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <div style={{ display: "inline-block", fontSize: 48, marginBottom: 24 }}>🍋</div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Start Creating Better<br /><span className="lime">AI Images Today</span>
            </h2>
            <p style={{ fontSize: 18, color: "rgba(232,232,240,0.6)", marginBottom: 40, lineHeight: 1.6 }}>
              Explore curated prompts. Copy. Paste. Generate.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/"><button className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>🚀 Explore Prompts</button></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}