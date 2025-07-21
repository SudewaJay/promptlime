"use client";


import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import { WobbleCard } from "@/components/ui/wobble-card";
import { AnimatedTooltipPreview } from "@/components/AnimatedTooltipPreview";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* 🌟 Hero Section */}
      <section className="bg-black">
        <AboutHero />
      </section>

      {/* ✨ Animated Team Tooltip */}
      <AnimatedTooltipPreview />

      {/* 💫 Wobble Cards Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-8">
        <WobbleCard>
          <h3 className="text-2xl font-semibold max-w-4xl mb-2 text-white">
            Why We Exist
          </h3>
          <p className="text-white/80">
            We blend technology, creativity, and empathy to help brands connect
            with real people. Every click matters.
          </p>
        </WobbleCard>

        <WobbleCard>
          <h3 className="text-2xl font-semibold mb-2 text-white">
            What Makes Us Different
          </h3>
          <p className="text-white/80">
            Our team is built on passion and precision. We do not just design —
            we solve problems with style.
          </p>
        </WobbleCard>
      </section>

      {/* 🌈 Background Glow */}
      <div className="fixed top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-lime-400/30 to-transparent blur-3xl pointer-events-none z-0" />

      {/* 📄 Main About Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-32 space-y-28">
        {/* Section 1: Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Our Story</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We believe in crafting the future of digital creativity, one pixel
            at a time. Here's how we got here.
          </p>
        </motion.section>

        {/* Section 2: Journey */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          <Image
            src="/about-journey.jpg"
            width={600}
            height={400}
            alt="Journey"
            className="rounded-2xl w-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-3">Humble Beginnings</h2>
            <p className="text-gray-400">
              Founded in 2021, Unix Studio started as a passion project. Today,
              we work with clients around the world to design impactful web and
              brand experiences.
            </p>
          </div>
        </motion.section>

        {/* Section 3: Mission */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/5 p-10 rounded-2xl border border-white/10 text-center"
        >
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-300">
            To empower businesses through creative storytelling, thoughtful
            design, and cutting-edge technology.
          </p>
        </motion.section>

        {/* Section 4: Meet the Team */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold mb-10">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sudewa Jayanath",
                role: "Founder & CEO",
                image: "/sudewa.jpg",
              },
              {
                name: "Tharindu",
                role: "UX Strategist",
                image: "/team2.jpg",
              },
              {
                name: "Nadeesha",
                role: "Developer",
                image: "/team3.jpg",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 p-5 rounded-xl text-left"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={500}
                  height={300}
                  className="rounded-xl w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}