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
    
    if (onStartDismiss) {
      onStartDismiss();
    }
    
    // Smooth 0.5s fade exit
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [onComplete, onStartDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3800);

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
        <motion.div 
          className="fixed inset-0 z-[10000] bg-[#0b0b0f] flex flex-col items-center justify-center overflow-hidden pointer-events-auto transform-gpu"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: "-30%",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          {/* Ambient gold background glow */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#c5a880]/[0.02] blur-[100px] pointer-events-none select-none" />

          {/* Core Logo + Title Container */}
          <div className="relative flex flex-col items-center justify-center text-center px-6 z-10">
            {/* 1. Central Logo Asset */}
            <motion.div
              className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px] mb-6"
              initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/LOGO.webp"
                alt="VISIONATRIX Logo"
                fill
                priority
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.08))",
                }}
              />
            </motion.div>

            {/* 2. Typographic Letter Stagger */}
            <motion.h1
              className="text-white font-display text-sm md:text-base tracking-[0.4em] uppercase flex justify-center items-center select-none"
            >
              {textLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.7 + index * 0.04,
                  }}
                  className={index === textLetters.length - 1 ? "" : "mr-[0.4em]"}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* 3. Skip Intro Bypass Button */}
          <motion.button
            onClick={handleDismiss}
            data-cursor="skip intro"
            className="absolute bottom-12 px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] text-white/50 cursor-pointer overflow-hidden z-20 select-none font-mono text-[9px] uppercase tracking-[0.2em] hover:text-white hover:border-white/30 transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <span className="flex items-center justify-center gap-1.5">
              Skip Intro <span className="text-[10px]">↓</span>
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
