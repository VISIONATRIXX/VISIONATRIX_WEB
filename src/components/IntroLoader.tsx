"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 6 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      onComplete();
    }, 800); // Allow exit animations to finish
  };

  // SVG drawing configuration
  const logoPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring" as const, duration: 2, bounce: 0 },
        opacity: { duration: 0.5 }
      }
    }
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 120 }
    }
  };

  const brandName = "VISIONATRIX";

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000]"
          exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Animated Glowing Logo SVG */}
          <div className="relative mb-8">
            <svg
              className="w-24 h-24 text-white"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Upper eye curve */}
              <motion.path
                d="M10 50C10 50 30 20 50 20C70 20 90 50 90 50"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                variants={logoPathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* Lower eye curve */}
              <motion.path
                d="M10 50C10 50 30 80 50 80C70 80 90 50 90 50"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                variants={logoPathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* Inner upper curve */}
              <motion.path
                d="M25 50C25 50 37 32 50 32C63 32 75 50 75 50"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={logoPathVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              />
              {/* Inner lower curve */}
              <motion.path
                d="M25 50C25 50 37 68 50 68C63 68 75 50 75 50"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={logoPathVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              />
              {/* Core central infinity circle */}
              <motion.path
                d="M38 50C38 43.3726 43.3726 38 50 38C56.6274 38 62 43.3726 62 50C62 56.6274 56.6274 62 50 62C43.3726 62 38 56.6274 38 50Z"
                stroke="#c5a880"
                strokeWidth="3.5"
                variants={logoPathVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 bg-gold/10 blur-xl rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.2] }}
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />
          </div>

          {/* Letter by Letter Brand Reveal */}
          <motion.h1
            className="font-display text-xl md:text-2xl font-bold tracking-[0.4em] text-white text-center flex items-center justify-center pl-[0.4em]"
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {brandName.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Skip button at bottom */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <button
              onClick={handleDismiss}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <span className="font-sans text-[10px] tracking-[0.25em] text-[#6b7280] group-hover:text-[#c5a880] transition-colors duration-300 uppercase">
                Skip Intro
              </span>
              <motion.div
                className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-[#6b7280] group-hover:text-[#c5a880] group-hover:border-[#c5a880]/40 transition-all duration-300"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <svg
                  className="w-3.5 h-3.5"
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
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
