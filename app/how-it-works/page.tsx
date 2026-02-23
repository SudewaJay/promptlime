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

const Reveal = ({ children, delay = 0, className = "", style = {} }: { children: React.ReactNode, delay?: number, className?: string, style?: React.CSSProperties }) => {
    const [ref, inView] = useInView();
    return (
        <div ref={ref} className={className} style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
            ...style
        }}>
            {children}
        </div>
    );
};

export default function HowItWorksPage() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActiveStep(p => (p + 1) % 3), 2800);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080810", color: "#e8e8f0", minHeight: "100vh", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lime { color: #c8f135; }
        .mint { color: #5bf5b0; }
        .gold { color: #f5c85b; }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 5vw, 60px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -2.5px;
        }

        .section-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(232,232,240,0.4);
        }

        .btn-lime {
          background: #c8f135;
          color: #080810;
          border: none;
          border-radius: 100px;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 32px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-lime:hover { background: #d9f55a; transform: scale(1.03); }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 24px 0;
        }

        .noise-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 200; opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .platform-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
        }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

            <div className="noise-layer" />

            {/* HEADER */}
            <Header />

            {/* HERO */}
            <section style={{ paddingTop: 160, paddingBottom: 80, maxWidth: 1200, margin: "0 auto", padding: "160px 24px 80px", position: "relative" }}>
                {/* bg orbs */}
                <div style={{ position: "absolute", top: 60, left: "60%", width: 500, height: 500, borderRadius: "50%", background: "#c8f135", filter: "blur(160px)", opacity: 0.07, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 200, left: "10%", width: 300, height: 300, borderRadius: "50%", background: "#5bf5b0", filter: "blur(120px)", opacity: 0.05, pointerEvents: "none" }} />

                <div style={{ maxWidth: 760, position: "relative", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Reveal>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8f135", animation: "pulse-dot 2s ease-in-out infinite" }} />
                            <span className="section-label">How It Works</span>
                        </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <h1 className="hero-title" style={{ marginBottom: 28 }}>
                            Three Steps to<br />
                            <span style={{ color: "#c8f135" }}>Stunning</span> AI Art
                        </h1>
                    </Reveal>
                    <Reveal delay={0.16}>
                        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(232,232,240,0.6)", lineHeight: 1.75, maxWidth: 560, marginBottom: 40 }}>
                            No prompt engineering skills. No technical setup. Just copy a prompt from PromptLime, add your photo to ChatGPT or Gemini, and generate.
                        </p>
                    </Reveal>
                    <Reveal delay={0.24}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "rgba(232,232,240,0.4)", fontSize: 13 }}>Works with</span>
                            <div className="platform-chip" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Gemini
                            </div>
                            <div className="platform-chip" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" /></svg>
                                ChatGPT
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Mini step indicator */}
                <Reveal delay={0.3} style={{ marginTop: 60, display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                        {["Copy Prompt", "Add Photo + Paste", "Generate"].map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                                    borderRadius: 100, fontSize: 13, fontWeight: 500,
                                    background: activeStep === i ? "rgba(200,241,53,0.15)" : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${activeStep === i ? "rgba(200,241,53,0.4)" : "rgba(255,255,255,0.08)"}`,
                                    color: activeStep === i ? "#c8f135" : "rgba(232,232,240,0.4)",
                                    transition: "all 0.4s ease"
                                }}>
                                    <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 11 }}>0{i + 1}</span>
                                    {s}
                                </div>
                                {i < 2 && <span style={{ color: "rgba(232,232,240,0.2)", fontSize: 18 }}>→</span>}
                            </div>
                        ))}
                    </div>
                </Reveal>
            </section>

            {/* STEP 1 */}
            <StepSection
                num="01"
                accent="#c8f135"
                tag="Step One"
                title={<>Browse & <span style={{ color: "#c8f135" }}>Copy</span> a Prompt</>}
                desc="Head to PromptLime.space and explore our curated library. Prompts are organized by style — cinematic, anime, fantasy, oil painting, neon, and dozens more. Found one you love? Hit the copy button and it's on your clipboard instantly."
                bullets={["Hundreds of hand-crafted, tested prompts", "Organized by style and mood", "One-click copy — zero friction"]}
                visual={<CopyStepVisual />}
                flip={false}
            />

            {/* STEP 2 */}
            <StepSection
                num="02"
                accent="#5bf5b0"
                tag="Step Two"
                title={<>Upload Your Photo<br /><span style={{ color: "#5bf5b0" }}>& Paste</span> the Prompt</>}
                desc="Open ChatGPT (with image generation) or Google Gemini. Upload your photo — a portrait, product image, landscape, or anything else. Then paste the prompt you copied from PromptLime right alongside it. That's all the setup you need."
                bullets={["Works with ChatGPT image gen & Gemini", "Upload any photo you want transformed", "Paste prompt → you're ready to go"]}
                visual={<PasteStepVisual />}
                flip={true}
            />

            {/* STEP 3 */}
            <StepSection
                num="03"
                accent="#f5c85b"
                tag="Step Three"
                title={<>Hit Generate &<br /><span style={{ color: "#f5c85b" }}>Watch the Magic</span></>}
                desc="Press generate and let the AI do its work. In seconds, your photo is transformed into a stunning AI artwork — styled with the exact aesthetic from the prompt. Professional results, zero prompt engineering required."
                bullets={["Studio-quality AI image output", "Your face / subject stays accurate", "Download and share instantly"]}
                visual={<GenerateStepVisual />}
                flip={false}
            />

            {/* VISUAL FLOW SUMMARY */}
            <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <Reveal>
                        <p className="section-label" style={{ marginBottom: 40 }}>The Full Flow</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
                            {[
                                { icon: "🍋", label: "PromptLime", sub: "Browse library" },
                                null,
                                { icon: "📋", label: "Copy Prompt", sub: "One click" },
                                null,
                                { icon: "🖼️", label: "Add Your Photo", sub: "Any image" },
                                null,
                                { icon: "🤖", label: "ChatGPT / Gemini", sub: "Paste & send" },
                                null,
                                { icon: "✨", label: "Stunning Art", sub: "Download & share" },
                            ].map((item, i) =>
                                item === null ? (
                                    <div key={i} style={{ padding: "0 8px", color: "rgba(200,241,53,0.4)", fontSize: 20 }}>→</div>
                                ) : (
                                    <Reveal key={i} delay={i * 0.06}>
                                        <div style={{ textAlign: "center", padding: "16px 20px" }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px" }}>{item.icon}</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0", marginBottom: 3 }}>{item.label}</div>
                                            <div style={{ fontSize: 11, color: "rgba(232,232,240,0.35)" }}>{item.sub}</div>
                                        </div>
                                    </Reveal>
                                )
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ maxWidth: 760, margin: "0 auto", padding: "100px 24px" }}>
                <Reveal>
                    <p className="section-label" style={{ marginBottom: 16 }}>Common Questions</p>
                    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 48 }}>
                        Quick <span style={{ color: "#c8f135" }}>Answers</span>
                    </h2>
                </Reveal>
                {[
                    { q: "Do I need to pay for PromptLime?", a: "Nope! PromptLime is completely free to use. Browse, copy, and generate to your heart's content." },
                    { q: "Do I need a ChatGPT or Gemini subscription?", a: "ChatGPT image generation requires a Plus or Pro subscription. Google Gemini has a free tier that supports image prompts." },
                    { q: "Can I use any photo?", a: "Yes — portraits, product photos, landscapes, pets, illustrations. If the AI can process it, PromptLime's prompts will transform it." },
                    { q: "Why use PromptLime prompts instead of writing my own?", a: "Our prompts are tested and refined for maximum output quality. Writing great prompts takes time and expertise — we've done that work for you." },
                    { q: "What styles of prompts are available?", a: "Studio Ghibli, cinematic film, anime, oil painting, neon noir, vintage, watercolor, fantasy, and many more — with new styles added regularly." },
                ].map((faq, i) => (
                    <Reveal key={i} delay={i * 0.06}>
                        <FaqItem q={faq.q} a={faq.a} />
                    </Reveal>
                ))}
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 24px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "#c8f135", filter: "blur(160px)", opacity: 0.07, pointerEvents: "none", borderRadius: "50%" }} />
                <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ fontSize: 52, marginBottom: 24, display: "inline-block", animation: "float 3s ease-in-out infinite" }}>🍋</div>
                        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 20 }}>
                            Ready to Try It?<br /><span style={{ color: "#c8f135" }}>It Takes 30 Seconds.</span>
                        </h2>
                        <p style={{ fontSize: 17, color: "rgba(232,232,240,0.55)", marginBottom: 40, lineHeight: 1.7 }}>
                            Pick a prompt, upload your photo, and generate something extraordinary.
                        </p>
                        <Link href="/"><button className="btn-lime" style={{ fontSize: 16, padding: "16px 40px" }}>🚀 Start Creating Now</button></Link>
                    </Reveal>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

/* ── Sub-components ── */

function StepSection({ num, accent, tag, title, desc, bullets, visual, flip }: { num: string, accent: string, tag: string, title: React.ReactNode, desc: string, bullets: string[], visual: React.ReactNode, flip: boolean }) {
    const [ref, inView] = useInView(0.12);
    return (
        <section ref={ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 72,
                alignItems: "center",
                direction: flip ? "rtl" : "ltr"
            }}>
                <div style={{ direction: "ltr", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${flip ? 40 : -40}px)`, transition: "all 0.7s ease 0.1s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ background: `${accent}18`, border: `1px solid ${accent}40`, borderRadius: 100, padding: "4px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 11, color: accent }}>{num}</span>
                            <span style={{ fontSize: 11, color: `${accent}cc`, letterSpacing: "0.1em", textTransform: "uppercase" }}>{tag}</span>
                        </div>
                    </div>
                    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 20 }}>{title}</h2>
                    <p style={{ fontSize: 16, color: "rgba(232,232,240,0.6)", lineHeight: 1.8, marginBottom: 28 }}>{desc}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {bullets.map((b, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${accent}18`, border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
                                </div>
                                <span style={{ fontSize: 14, color: "rgba(232,232,240,0.7)" }}>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ direction: "ltr", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${flip ? -40 : 40}px)`, transition: "all 0.7s ease 0.2s" }}>
                    {visual}
                </div>
            </div>
        </section>
    );
}

function CopyStepVisual() {
    const [copied, setCopied] = useState(false);
    const prompts = [
        { tag: "Ghibli", text: "Transform into Studio Ghibli watercolor style, warm golden light, dreamy atmosphere...", color: "#c8f135" },
        { tag: "Cinematic", text: "Dramatic cinematic portrait, anamorphic lens flare, teal and orange grade, film grain...", color: "#5bf5b0" },
        { tag: "Anime", text: "High-detail anime illustration, cel shading, vibrant colors, expressive eyes...", color: "#f5c85b" },
    ];
    return (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(232,232,240,0.35)" }}>promptlime.space</span>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {prompts.map((p, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
                        onClick={() => { if (i === 0) setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                        <div>
                            <div style={{ display: "inline-block", background: `${p.color}18`, border: `1px solid ${p.color}30`, color: p.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, letterSpacing: "0.08em", marginBottom: 8 }}>{p.tag}</div>
                            <p style={{ fontSize: 12, color: "rgba(232,232,240,0.55)", lineHeight: 1.6 }}>{p.text}</p>
                        </div>
                        <button style={{ flexShrink: 0, background: i === 0 && copied ? "rgba(200,241,53,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${i === 0 && copied ? "rgba(200,241,53,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "7px 12px", color: i === 0 && copied ? "#c8f135" : "rgba(232,232,240,0.6)", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                            {i === 0 && copied ? "✓ Copied!" : "📋 Copy"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PasteStepVisual() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Platform tabs */}
            <div style={{ display: "flex", gap: 10 }}>
                {["ChatGPT", "Gemini"].map((p, i) => (
                    <div key={p} style={{ flex: 1, padding: "10px", textAlign: "center", borderRadius: 10, background: i === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`, fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#e8e8f0" : "rgba(232,232,240,0.4)" }}>
                        {p}
                    </div>
                ))}
            </div>
            {/* Chat UI mockup */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", animation: "pulse-dot 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 12, color: "rgba(232,232,240,0.4)" }}>ChatGPT — New Chat</span>
                </div>
                <div style={{ padding: 20 }}>
                    {/* Photo upload indicator */}
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
                        <div style={{ flex: 1 }}>
                            {/* Image attachment */}
                            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 6, background: "linear-gradient(135deg, #667eea, #764ba2)", flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#e8e8f0", marginBottom: 2 }}>my_photo.jpg</div>
                                    <div style={{ fontSize: 10, color: "rgba(232,232,240,0.35)" }}>Image uploaded ✓</div>
                                </div>
                            </div>
                            {/* Pasted prompt */}
                            <div style={{ background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                                <div style={{ fontSize: 10, color: "#c8f135", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6 }}>PROMPT PASTED ↓</div>
                                <p style={{ fontSize: 11, color: "rgba(232,232,240,0.65)", lineHeight: 1.6 }}>Transform into Studio Ghibli watercolor style, warm golden light, dreamy atmosphere, soft brush strokes...</p>
                            </div>
                        </div>
                    </div>
                    {/* Send button */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ background: "#c8f135", color: "#080810", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                            Generate ↑
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GenerateStepVisual() {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        let v = 0;
        const t = setInterval(() => {
            v += Math.random() * 8 + 3;
            if (v >= 100) { v = 100; setDone(true); clearInterval(t); setTimeout(() => { setProgress(0); setDone(false); }, 2500); }
            setProgress(v);
        }, 180);
        return () => clearInterval(t);
    }, [done]);

    return (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 12, color: "rgba(232,232,240,0.35)" }}>AI is generating your image...</span>
            </div>
            <div style={{ padding: 24 }}>
                {/* Output preview area */}
                <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 18, position: "relative", height: 180, background: done ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", transition: "background 0.5s ease" }}>
                    {done ? (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
                            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "#c8f135" }}>Studio Ghibli Transform</div>
                            <div style={{ fontSize: 11, color: "rgba(232,232,240,0.5)", marginTop: 4 }}>Generation complete ✨</div>
                            {/* Decorative particles */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: "#c8f135", opacity: 0.6, top: `${20 + i * 12}%`, left: `${10 + i * 15}%`, animation: `float ${2 + i * 0.3}s ease-in-out infinite` }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(200,241,53,0.2)", borderTopColor: "#c8f135", animation: "spin-slow 1s linear infinite" }} />
                        </div>
                    )}
                </div>
                {/* Progress bar */}
                <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "rgba(232,232,240,0.4)" }}>{done ? "Complete!" : "Generating..."}</span>
                        <span style={{ fontSize: 11, color: "#c8f135", fontWeight: 600 }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: "#c8f135", borderRadius: 2, transition: "width 0.15s ease", boxShadow: "0 0 8px rgba(200,241,53,0.5)" }} />
                    </div>
                </div>
                {done && (
                    <button style={{ width: "100%", background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.3)", borderRadius: 10, padding: "10px", color: "#c8f135", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        ⬇ Download Image
                    </button>
                )}
            </div>
        </div>
    );
}

function FaqItem({ q, a }: { q: string, a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item" onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: open ? "#c8f135" : "#e8e8f0", transition: "color 0.2s" }}>{q}</span>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: open ? "rgba(200,241,53,0.15)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "all 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</div>
            </div>
            {open && <p style={{ marginTop: 14, fontSize: 14, color: "rgba(232,232,240,0.6)", lineHeight: 1.75 }}>{a}</p>}
        </div>
    );
}


