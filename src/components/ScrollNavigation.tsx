"use client";

import { motion } from "framer-motion";

interface ScrollNavigationProps {
  activeSection: string;
  onDotClick: (sectionId: string) => void;
}

export default function ScrollNavigation({ activeSection, onDotClick }: ScrollNavigationProps) {
  const sections = [
    { id: "home", label: "HOME" },
    { id: "studio", label: "STUDIO" },
    { id: "services", label: "SERVICES" },
    { id: "works", label: "WORKS" },
    { id: "process", label: "PIPELINE" },
    { id: "engine-stack", label: "ENGINE STACK" },
    { id: "feedback", label: "FEEDBACK" },
    { id: "faq", label: "FAQ & CALENDAR" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-5 items-center">
      {sections.map((sec, idx) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onDotClick(sec.id)}
            className="group relative flex items-center justify-center w-6 h-6 focus:outline-none"
            aria-label={`Scroll to ${sec.label}`}
          >
            {/* Hover Tooltip Label */}
            <span className="absolute right-8 py-1 px-2.5 bg-black/90 border border-gold/20 text-[#c5a880] text-[10px] font-sans tracking-[0.15em] rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-md">
              {sec.label}
            </span>

            {/* Glowing active outer circle */}
            {isActive && (
              <motion.div
                className="absolute w-5 h-5 rounded-full border border-gold/60"
                layoutId="activeDotOuter"
                transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
              />
            )}

            {/* Dot itself */}
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-white scale-125"
                  : "bg-white/20 group-hover:bg-[#c5a880]/70 group-hover:scale-110"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
