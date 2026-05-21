"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroLoaderProps {
  onComplete: () => void;
  onStartDismiss?: () => void;
}

export default function IntroLoader({ onComplete, onStartDismiss }: IntroLoaderProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Cinematic auto-dismiss after 3.2 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3200);

    // 2. Keyboard listener for Escape key to bypass loader
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDismiss = () => {
    if (isDismissed) return;
    setIsDismissed(true);
    
    // Begin loading background assets in parallel with slide transition
    if (onStartDismiss) {
      onStartDismiss();
    }
    
    // Complete completely after the staggered curtains finish exiting (1.2s transition)
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const textLetters = Array.from("VISIONATRIX");

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <div className="fixed inset-0 z-[10000] overflow-hidden" style={{ pointerEvents: "all" }}>
          
          {/* Parallax Curtain Sheet 3: Translucent technical slate overlay */}
          <motion.div
            className="absolute inset-0 bg-[#0b0b0e] z-10 pointer-events-none"
            exit={{
              y: "-100%",
              transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.16 }
            }}
          />
          
          {/* Parallax Curtain Sheet 2: Translucent luxury gold accent sheet */}
          <motion.div
            className="absolute inset-0 bg-[#c5a880] opacity-15 z-20 pointer-events-none"
            exit={{
              y: "-100%",
              transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.08 }
            }}
          />

          {/* Parallax Curtain Sheet 1: Main deep black background container holding the loader */}
          <motion.div
            className="absolute inset-0 bg-[#050507] z-30 flex flex-col items-center justify-center overflow-hidden"
            exit={{
              y: "-100%",
              transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.0 }
            }}
          >
            {/* Ambient gold background node */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#c5a880]/[0.02] blur-[100px] pointer-events-none select-none" />

            {/* Core Logo + Title Container */}
            <div className="relative flex flex-col items-center justify-center text-center px-6">
              
              {/* 1. Central Logo Asset - delayed to bloom after text reveals */}
              <motion.div
                className="relative w-[100px] h-[100px] z-10 mb-6"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)", y: -10 }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 1.2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <Image
                  src="/LOGO.png"
                  alt="VISIONATRIX Logo"
                  fill
                  priority
                  className="object-contain"
                  style={{
                    filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.08))",
                  }}
                />
              </motion.div>

              {/* 2. Typographic Letter-by-Letter Staggered Reveal - starts immediately */}
              <motion.h1
                className="text-white font-display text-base md:text-lg tracking-[0.4em] z-10 uppercase flex justify-center items-center select-none"
                style={{
                  textShadow: "0 0 12px rgba(255, 255, 255, 0.06)",
                }}
              >
                {textLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.05,
                    }}
                    className={index === textLetters.length - 1 ? "" : "mr-[0.4em]"}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

            </div>

            {/* 3. Skip Intro Bypass Action Pill Button - delayed and sweeps with shine */}
            <motion.button
              onClick={handleDismiss}
              className="absolute bottom-16 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-white/50 cursor-pointer overflow-hidden z-40 select-none focus:outline-none"
              style={{
                fontFamily: "var(--font-mono-custom, 'JetBrains Mono', monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "#ffffff";
                el.style.borderColor = "rgba(255, 255, 255, 0.25)";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                el.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255, 255, 255, 0.5)";
                el.style.borderColor = "rgba(255, 255, 255, 0.1)";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Text content with clean down-arrow character */}
              <span className="relative z-10 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em]">
                Skip Intro <span className="text-[10px] leading-none">↓</span>
              </span>

              {/* Shimmer / Diagonal Sweep Shine Effect */}
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.4,
                  ease: "easeInOut",
                  repeatDelay: 2.8, // Sweeps every 4.2 seconds
                }}
                style={{
                  top: 0,
                  height: "100%",
                }}
              />
            </motion.button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
