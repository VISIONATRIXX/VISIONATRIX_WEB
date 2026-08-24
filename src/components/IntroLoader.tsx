"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroLoaderProps {
  onComplete: () => void;
  onStartDismiss?: () => void;
}

export default function IntroLoader({ onComplete, onStartDismiss }: IntroLoaderProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissedRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsDismissed(true);
    
    // Notify parent immediately that exit sequence has started
    if (onStartDismiss) {
      onStartDismiss();
    }
    
    // Complete after curtain exit completes (800ms ultra-smooth transition)
    setTimeout(() => {
      onComplete();
    }, 850);
  }, [onComplete, onStartDismiss]);

  useEffect(() => {
    // 1. Cinematic auto-dismiss after 3.8s
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3800);

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
  }, [handleDismiss]);

  const textLetters = Array.from("VISIONATRIX");

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <div className="fixed inset-0 z-[10000] overflow-hidden pointer-events-auto">
          
          {/* Main GPU Hardware-Accelerated Black Curtain Sheet with Gold Top Border Accent */}
          <motion.div
            className="absolute inset-0 bg-[#0b0b0f] z-30 flex flex-col items-center justify-center overflow-hidden border-b-2 border-[#c5a880]/60 shadow-[0_15px_50px_rgba(197,168,128,0.2)] transform-gpu"
            style={{
              willChange: "transform",
              transform: "translateZ(0)"
            }}
            exit={{
              y: "-100%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
          >
            {/* Ambient gold background glow */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#c5a880]/[0.02] blur-[100px] pointer-events-none select-none" />

            {/* Core Logo + Title Container */}
            <div className="relative flex flex-col items-center justify-center text-center px-6">
              
              {/* 1. Central Logo Asset */}
              <motion.div
                className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px] z-10 mb-8"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)", y: -10 }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ 
                  delay: 0.15, 
                  duration: 0.9, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <Image
                  src="/LOGO.webp"
                  alt="VISIONATRIX Logo"
                  fill
                  priority
                  className="object-contain"
                  style={{
                    filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.08))",
                  }}
                />
              </motion.div>

              {/* 2. Typographic Letter-by-Letter Staggered Reveal */}
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
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.9 + (index * 0.04),
                    }}
                    className={index === textLetters.length - 1 ? "" : "mr-[0.4em]"}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

            </div>

            {/* 3. Skip Intro Bypass Action Pill Button */}
            <motion.button
              onClick={handleDismiss}
              data-cursor="skip intro"
              className="absolute bottom-14 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-white/50 cursor-pointer overflow-hidden z-40 select-none focus:outline-none"
              style={{
                fontFamily: "var(--font-mono-custom, 'JetBrains Mono', monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "#ffffff";
                el.style.borderColor = "rgba(197, 168, 128, 0.4)";
                el.style.backgroundColor = "rgba(197, 168, 128, 0.08)";
                el.style.boxShadow = "0 0 20px rgba(197, 168, 128, 0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255, 255, 255, 0.5)";
                el.style.borderColor = "rgba(255, 255, 255, 0.1)";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                el.style.boxShadow = "none";
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em]">
                Skip Intro <span className="text-[10px] leading-none">↓</span>
              </span>

              {/* Shimmer / Diagonal Sweep Shine Effect */}
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#c5a880]/20 to-transparent -skew-x-12 pointer-events-none"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.4,
                  ease: "easeInOut",
                  repeatDelay: 2.8,
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
