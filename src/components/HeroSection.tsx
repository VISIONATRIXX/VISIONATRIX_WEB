"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  onCtaClick: (target: string) => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
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
      className="snap-section flex flex-col justify-between items-center py-20 px-6 md:px-12 bg-[#050507]"
    >
      {/* Background texture/glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] bg-[#c5a880]/3 opacity-[0.04] blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#000000_100%)]" />
      </div>

      {/* Top spacer for navigation */}
      <div className="h-16" />

      {/* Main Content Area */}
      <motion.div 
        className="flex flex-col items-center text-center max-w-5xl z-10 my-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Upper Tag */}
        <motion.div 
          className="border border-[#c5a880]/30 px-4 py-1.5 rounded-sm bg-[#c5a880]/5 mb-8 md:mb-10"
          variants={itemVariants}
        >
          <span className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-[#c5a880] uppercase">
            [ CREATIVE TECHNOLOGY STUDIO – MMXXVI ]
          </span>
        </motion.div>

        {/* Large Title */}
        <motion.h1 
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.18em] text-white pl-[0.18em] leading-none mb-6 text-gold-glow drop-shadow-[0_0_30px_rgba(197,168,128,0.1)]"
          variants={itemVariants}
        >
          VISIONATRIX
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="font-sans text-xs sm:text-sm md:text-base tracking-[0.4em] text-white/70 mb-10 pl-[0.4em]"
          variants={itemVariants}
        >
          DESIGN. VISUALIZE. EXPERIENCE.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          variants={itemVariants}
        >
          <button
            onClick={() => onCtaClick("works")}
            className="w-full sm:w-auto px-8 py-4 bg-[#c5a880] text-black font-sans text-xs font-semibold tracking-[0.2em] rounded-sm hover:bg-[#d8be99] hover:shadow-[0_0_25px_rgba(197,168,128,0.4)] transition-all duration-300"
          >
            VIEW PORTFOLIO
          </button>
          <button
            onClick={() => onCtaClick("contact")}
            className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-gold hover:bg-white/5 text-white font-sans text-xs font-semibold tracking-[0.2em] rounded-sm transition-all duration-300"
          >
            START PROJECT
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom Information Panel */}
      <motion.div 
        className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 items-end justify-between text-center md:text-left z-10 border-t border-white/5 pt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {/* Locations */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
            LOCATIONS
          </span>
          <span className="font-sans text-xs tracking-[0.1em] text-white font-medium">
            BENGALURU / MUMBAI / DELHI
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => onCtaClick("studio")}>
          <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
            SCROLL TO OBSERVE
          </span>
          <motion.div
            className="text-gold"
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
                d="M19 13l-7 7-7-7m14-6l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Focus */}
        <div className="flex flex-col gap-1 md:items-end">
          <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
            FOCUS
          </span>
          <span className="font-sans text-xs tracking-[0.1em] text-[#c5a880] font-medium uppercase">
            SENSORY ARCHITECTURE
          </span>
        </div>
      </motion.div>
    </section>
  );
}
