"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  activeSection: string;
  onNavClick: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      if (container && container.scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const container = document.querySelector(".snap-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const navItems = [
    { label: "HOME", id: "home" },
    { label: "STUDIO", id: "studio" },
    { label: "SERVICES", id: "services" },
    { label: "SHOWCASE", id: "works" }, // Map showcase to works as well
    { label: "WORKS", id: "works" },
    { label: "PROCESS", id: "process" },
    { label: "FAQ", id: "faq" },
    { label: "CONTACT", id: "contact" },
  ];

  // Helper to check if item is active
  const isItemActive = (item: typeof navItems[0]) => {
    if (item.id === activeSection) return true;
    // Map process sub-sections (process, engine-stack, feedback) to PROCESS
    if (item.id === "process" && ["process", "engine-stack", "feedback"].includes(activeSection)) return true;
    return false;
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#050507]/90 backdrop-blur-md border-b border-gold/10 py-4" 
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo and Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavClick("home")}
        >
          {/* Logo SVG matching 1.png / 2.png */}
          <svg
            className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outermost upper curve */}
            <path
              d="M10 50C10 50 30 20 50 20C70 20 90 50 90 50"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Outermost lower curve */}
            <path
              d="M10 50C10 50 30 80 50 80C70 80 90 50 90 50"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Inner upper curve */}
            <path
              d="M25 50C25 50 37 32 50 32C63 32 75 50 75 50"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Inner lower curve */}
            <path
              d="M25 50C25 50 37 68 50 68C63 68 75 50 75 50"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Core center loop */}
            <path
              d="M38 50C38 43.3726 43.3726 38 50 38C56.6274 38 62 43.3726 62 50"
              stroke="#c5a880"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M38 50C38 56.6274 43.3726 62 50 62C56.6274 62 62 56.6274 62 50"
              stroke="#c5a880"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display font-bold tracking-[0.25em] text-white text-base md:text-lg group-hover:text-gold transition-colors duration-300">
            VISIONATRIX
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navItems.map((item, idx) => {
            const active = isItemActive(item);
            return (
              <button
                key={idx}
                onClick={() => onNavClick(item.id)}
                className={`font-sans text-xs tracking-[0.2em] transition-colors duration-300 ${
                  active 
                    ? "text-gold font-semibold" 
                    : "text-[#9999aa] hover:text-white"
                } nav-link-underline ${active ? "active" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Get Started CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavClick("contact")}
            className="border border-[#c5a880]/30 hover:border-gold bg-[#c5a880]/5 hover:bg-[#c5a880]/15 text-white font-sans text-xs tracking-[0.18em] px-5 py-2.5 rounded-sm transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(197,168,128,0.15)]"
          >
            <span>GET STARTED</span>
            <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
