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
    // Auto-dismiss after 5.5 seconds (matching old site timing)
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onStartDismiss) {
      onStartDismiss();
    }
    setTimeout(() => {
      onComplete();
    }, 3000); // Allow exit animation to finish (3 seconds)
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
          style={{ pointerEvents: "all" }}
          exit={{
            y: "-100%",
            transition: { duration: 3.0, ease: [0.85, 0, 0.15, 1] },
          }}
        >
          {/* Logo + Title Container — matching .intro-logo-wrap */}
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {/* Large Logo Image — matching .intro-logo-img (80vw, max-width 320px) */}
            <motion.div
              className="relative w-[80vw] max-w-[320px] aspect-square"
              style={{ marginBottom: "-1.5rem" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.6,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <Image
                src="/LOGO.png"
                alt="VISIONATRIX Eye Icon"
                fill
                priority
                className="object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 35px rgba(255, 255, 255, 0.12))",
                }}
              />
            </motion.div>

            {/* Title — matching .intro-title: Michroma, 1.5rem, letter-spacing 0.35em */}
            <motion.h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-michroma)",
                fontSize: "1.5rem",
                fontWeight: 400,
                letterSpacing: "0.35em",
                textIndent: "0.35em",
                marginTop: 0,
                textShadow: "0 0 15px rgba(255, 255, 255, 0.08)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                duration: 1.0,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              VISIONATRIX
            </motion.h1>
          </div>

          {/* Skip Intro Button — matching .intro-skip-btn: pill shape, JetBrains Mono */}
          <motion.button
            onClick={handleDismiss}
            className="absolute bottom-16 select-none focus:outline-none cursor-pointer"
            style={{
              fontFamily: "var(--font-mono-custom, 'JetBrains Mono', monospace)",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              color: "rgba(255, 255, 255, 0.35)",
              padding: "0.5rem 1.2rem",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(5px)",
              transition:
                "color 0.25s cubic-bezier(0.25,1,0.5,1), border-color 0.25s cubic-bezier(0.25,1,0.5,1), background-color 0.25s cubic-bezier(0.25,1,0.5,1)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = "#c8a261";
              el.style.borderColor = "#c8a261";
              el.style.backgroundColor = "rgba(200, 162, 97, 0.05)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = "rgba(255, 255, 255, 0.35)";
              el.style.borderColor = "rgba(255, 255, 255, 0.08)";
              el.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            }}
          >
            Skip Intro ↓
          </motion.button>

          {/* Mobile responsive adjustments handled via media query in globals */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
