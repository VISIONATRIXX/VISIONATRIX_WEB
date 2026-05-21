"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  onCtaClick: (target: string) => void;
  triggerEntrance?: boolean;
}

export default function HeroSection({ onCtaClick, triggerEntrance = false }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <section 
      id="home" 
      className="snap-section flex flex-col justify-between items-center pt-24 pb-8 px-6 md:px-12 bg-[#050507]"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm center glow behind title */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60vw] h-[25vw] bg-[#c5a880]/4 blur-[140px] rounded-full" />
        {/* Vignette edge darken */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#000000_100%)]" />
      </div>

      {/* Main Content Area */}
      <motion.div 
        className="flex flex-col items-center text-center max-w-5xl z-10 my-auto"
        variants={containerVariants}
        initial="hidden"
        animate={triggerEntrance ? "visible" : "hidden"}
      >
        {/* Upper Tag — matches 2.png exactly */}
        <motion.div 
          className="border border-[#c5a880]/25 px-6 py-2 rounded-sm bg-[#c5a880]/5 mb-8 md:mb-10"
          variants={itemVariants}
        >
          <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-[#c5a880] uppercase">
            [ CREATIVE TECHNOLOGY STUDIO — MMXXVI ]
          </span>
        </motion.div>

        {/* Large Title — Michroma, bold, wide tracked, with staggered clip-mask reveal */}
        <h1 
          className="font-display text-3xl min-[360px]:text-4xl min-[480px]:text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] tracking-[0.08em] text-white leading-none mb-6 text-gold-glow drop-shadow-[0_0_40px_rgba(197,168,128,0.08)] flex justify-center whitespace-nowrap overflow-hidden"
        >
          {"VISIONATRIX".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: "105%", opacity: 0 }}
              animate={triggerEntrance ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
              transition={{
                delay: 0.2 + index * 0.05,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block origin-bottom"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtext — Michroma, lighter weight, spaced, word-by-word reveal */}
        <p className="font-sans text-[11px] sm:text-xs md:text-sm tracking-[0.35em] text-white/50 mb-12 flex flex-wrap justify-center gap-x-2">
          {"DESIGN. VISUALIZE. EXPERIENCE.".split(" ").map((word, index) => (
            <span key={index} className="inline-block overflow-hidden py-0.5">
              <motion.span
                initial={{ y: "105%" }}
                animate={triggerEntrance ? { y: 0 } : { y: "105%" }}
                transition={{
                  delay: 0.85 + index * 0.12,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        {/* Action Buttons — matching 2.png: gold filled + white bordered */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          variants={itemVariants}
        >
          <button
            onClick={() => onCtaClick("works")}
            className="px-10 py-4 bg-[#c5a880] text-[#0a0a0a] font-outfit text-[11px] tracking-[0.18em] rounded-sm hover:bg-[#d4bb95] hover:shadow-[0_0_30px_rgba(197,168,128,0.35)] transition-all duration-300 cursor-pointer"
          >
            VIEW PORTFOLIO
          </button>
          <button
            onClick={() => onCtaClick("contact")}
            className="px-10 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-outfit text-[11px] tracking-[0.18em] rounded-sm transition-all duration-300 cursor-pointer"
          >
            START PROJECT
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom Information Panel — matches 2.png layout: two columns + scroll center */}
      <motion.div 
        className="w-full max-w-6xl px-4 md:px-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={triggerEntrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Two column: Locations left, Focus right */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-center md:text-left border-t border-white/5 pt-6 mb-6">
          {/* Locations */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
              LOCATIONS
            </span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-white">
              ACROSS THE WORLD
            </span>
          </div>

          {/* Focus */}
          <div className="flex flex-col gap-1 md:items-end">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
              FOCUS
            </span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#c5a880]">
              SENSORY ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Scroll Indicator — centered below, matching 2.png */}
        <div 
          className="flex flex-col items-center gap-2 cursor-pointer" 
          onClick={() => onCtaClick("studio")}
        >
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
            SCROLL TO OBSERVE
          </span>
          <motion.div
            className="text-[#c5a880]"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
