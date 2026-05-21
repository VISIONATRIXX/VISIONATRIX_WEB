"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeaderProps {
  activeSection: string;
  onNavClick: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Calculate scroll progress percentage
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "HOME", id: "home" },
    { label: "STUDIO", id: "studio" },
    { label: "SERVICES", id: "services" },
    { label: "SHOWCASE", id: "works" },
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
          ? "bg-[#050507]/85 border-b border-[#c5a880]/15 py-3.5 shadow-lg shadow-black/10" 
          : "bg-[#050507]/35 border-b border-transparent py-5"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
    >
      {/* Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#c5a880] via-[#e2cbb0] to-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.75)] will-change-[width]"
        style={{ width: "0%" }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavClick("home")}
        >
          {/* Actual LOGO.png */}
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/LOGO.png"
              alt="Visionatrix Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="font-display tracking-[0.2em] text-white text-sm md:text-base group-hover:text-[#c5a880] transition-colors duration-300">
            VISIONATRIX
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navItems.map((item, idx) => {
            const active = isItemActive(item);
            return (
              <button
                key={idx}
                onClick={() => onNavClick(item.id)}
                className={`font-outfit text-[11px] tracking-[0.15em] transition-colors duration-300 cursor-pointer ${
                  active 
                    ? "text-white font-semibold" 
                    : "text-[#7a7a8a] hover:text-white"
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
            className="border border-[#c5a880]/40 hover:border-[#c5a880] bg-transparent hover:bg-[#c5a880]/10 text-[#c5a880] font-outfit text-[10px] tracking-[0.18em] px-5 py-2.5 rounded-sm transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
          >
            <span>GET STARTED</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
