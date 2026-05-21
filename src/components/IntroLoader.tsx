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
  const [progress, setProgress] = useState(0);
  const [telemetryText, setTelemetryText] = useState("CALIBRATING SPATIAL NODE");

  useEffect(() => {
    // 1. Smooth telemetry calibration progress (1.8 seconds)
    const startTime = Date.now();
    const duration = 1800;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(progressPercent);

      // Cybernetic telemetry status updates
      if (progressPercent < 20) {
        setTelemetryText("INITIALIZING CORE SPATIAL MATRIX //");
      } else if (progressPercent < 45) {
        setTelemetryText("LOADING VOLUMETRIC DATASETS // 0x5F7A");
      } else if (progressPercent < 70) {
        setTelemetryText("COMPILING THREE.JS VERTEX SHADERS // GLSL");
      } else if (progressPercent < 90) {
        setTelemetryText("CACHING OCTANE RENDER PIPELINES // PASS 1");
      } else {
        setTelemetryText("DIAGNOSTICS COMPLETE // SYSTEM ONLINE");
      }

      if (progressPercent < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    // 2. Snappy auto-dismiss after 2.2s
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2200);

    return () => clearTimeout(timer);
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

          {/* Parallax Curtain Sheet 1: Main deep black background container holding the loader HUD */}
          <motion.div
            className="absolute inset-0 bg-[#050507] z-30 flex flex-col items-center justify-center overflow-hidden"
            exit={{
              y: "-100%",
              transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.0 }
            }}
          >
            {/* Ambient gold background node */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#c5a880]/[0.02] blur-[100px] pointer-events-none select-none" />

            {/* Core Logo + Title HUD */}
            <div className="relative flex flex-col items-center justify-center text-center">
              
              {/* Cinematic self-drawing SVG Reticle Aperture */}
              <div className="absolute w-[340px] h-[340px] flex items-center justify-center z-[1] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer coordinate dots */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="rgba(197, 168, 128, 0.12)"
                    strokeWidth="0.75"
                    strokeDasharray="2 12"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Rotating technical telemetry ticks */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="76"
                    fill="none"
                    stroke="rgba(197, 168, 128, 0.25)"
                    strokeWidth="1.0"
                    strokeDasharray="4 6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Self-drawing glowing primary optic loop */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="68"
                    fill="none"
                    stroke="#c5a880"
                    strokeWidth="1.2"
                    initial={{ strokeDasharray: "0 500", strokeDashoffset: 0, opacity: 0 }}
                    animate={{ strokeDasharray: "340 100", strokeDashoffset: -120, opacity: [0, 0.8, 0.5] }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              {/* Central Logo Asset */}
              <motion.div
                className="relative w-[180px] h-[180px] z-10"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src="/LOGO.png"
                  alt="VISIONATRIX Logo"
                  fill
                  priority
                  className="object-contain"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(197, 168, 128, 0.15))",
                  }}
                />
              </motion.div>

              {/* Typographic Expansion Reveal */}
              <motion.h1
                className="text-white font-display text-lg tracking-[0.25em] z-10 uppercase mt-4"
                style={{
                  textShadow: "0 0 15px rgba(255, 255, 255, 0.08)",
                }}
                initial={{ opacity: 0, letterSpacing: "-0.05em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                VISIONATRIX
              </motion.h1>

              {/* Monospace telemetry calibration ticker */}
              <div className="mt-8 flex flex-col items-center gap-1.5 z-10 select-none">
                <span className="font-mono text-[11px] text-[#c5a880] tracking-[0.2em] font-extrabold text-gold-glow">
                  {progress.toString().padStart(3, "0")}% // CALIBRATION
                </span>
                
                {/* Micro-loading telemetry bar */}
                <div className="w-[180px] h-[1px] bg-white/5 relative overflow-hidden rounded-full">
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-[#c5a880] shadow-[0_0_8px_#c5a880]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                <span className="font-mono text-[8px] text-[#555566] tracking-[0.18em] uppercase max-w-[280px] h-4">
                  {telemetryText}
                </span>
              </div>

            </div>

            {/* Skip Intro Bypass Action Node */}
            <motion.button
              onClick={handleDismiss}
              className="absolute bottom-16 select-none focus:outline-none cursor-pointer z-40"
              style={{
                fontFamily: "var(--font-mono-custom, 'JetBrains Mono', monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                color: "rgba(255, 255, 255, 0.35)",
                padding: "0.45rem 1.1rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "2px",
                backgroundColor: "rgba(255, 255, 255, 0.01)",
                backdropFilter: "blur(5px)",
                transition: "all 0.30s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "#c5a880";
                el.style.borderColor = "#c5a880";
                el.style.backgroundColor = "rgba(197, 168, 128, 0.05)";
                el.style.boxShadow = "0 0 15px rgba(197, 168, 128, 0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255, 255, 255, 0.35)";
                el.style.borderColor = "rgba(255, 255, 255, 0.08)";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
                el.style.boxShadow = "none";
              }}
            >
              BYPASS DIAGNOSTICS [ ESC ]
            </motion.button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
