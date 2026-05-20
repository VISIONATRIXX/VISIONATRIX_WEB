"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 6.5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      onComplete();
    }, 850); // Allow exit animations to finish
  };

  // Logo animation variants
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, filter: "blur(12px)" },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      }
    }
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.4
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 90, damping: 15 }
    }
  };

  const brandName = "VISIONATRIX";

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000]"
          exit={{ 
            opacity: 0, 
            filter: "blur(20px)", 
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Logo Container */}
          <div className="relative mb-8 flex flex-col items-center justify-center">
            {/* Ambient Background Radial Glow */}
            <motion.div
              className="absolute w-40 h-40 bg-[#c5a880]/10 blur-2xl rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.5, 0.25], scale: [0.8, 1.1, 1.0] }}
              transition={{ delay: 0.5, duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
            />

            {/* Glowing Logo Element */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center overflow-hidden rounded-sm"
            >
              <Image
                src="/LOGO.png"
                alt="Visionatrix Agency Logo"
                fill
                priority
                className="object-contain filter brightness-110"
              />

              {/* Shimmer sweep animation overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ left: "-150%" }}
                animate={{ left: "150%" }}
                transition={{
                  delay: 1.8,
                  duration: 1.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </motion.div>
          </div>

          {/* Letter by Letter Brand Reveal */}
          <motion.h1
            className="font-[var(--font-michroma)] text-lg md:text-xl tracking-[0.4em] text-white text-center flex items-center justify-center pl-[0.4em] mb-3"
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

          {/* Tagline Reveal */}
          <motion.p
            className="font-[var(--font-michroma)] text-[8px] md:text-[9px] tracking-[0.25em] text-[#555566] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
          >
            DESIGN. VISUALIZE. EXPERIENCE.
          </motion.p>

          {/* Skip button at bottom matching 1.png style */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
            <button
              onClick={handleDismiss}
              className="flex flex-col items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <span className="font-[var(--font-michroma)] text-[9px] tracking-[0.2em] text-[#555566] group-hover:text-[#c5a880] transition-colors duration-300 uppercase">
                Skip Intro
              </span>
              <motion.div
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[#555566] group-hover:text-[#c5a880] group-hover:border-[#c5a880]/30 transition-all duration-300"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
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
