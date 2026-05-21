"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeaderProps {
  activeSection: string;
  onNavClick: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
          ? "bg-[#050507]/85 border-b border-[#c5a880]/15 py-[18px] shadow-lg shadow-black/10" 
          : "bg-[#050507]/35 border-b border-transparent py-[26px]"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
    >
      {/* Top Gold Gradient Border (Background Line) */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#7c5f35] via-[#e2cbb0] via-[#7c5f35] via-[#e2cbb0] to-[#7c5f35] opacity-25 z-40" />

      {/* Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#7c5f35] via-[#e2cbb0] via-[#7c5f35] via-[#e2cbb0] to-[#7c5f35] shadow-[0_0_8px_rgba(197,168,128,0.6)] z-50 will-change-[width]"
        style={{ width: "0%" }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer group"
          onClick={() => onNavClick("home")}
        >
          {/* Actual LOGO.png */}
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/LOGO.png"
              alt="Visionatrix Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="font-display tracking-[0.25em] text-white text-base md:text-[17px] group-hover:text-[#c5a880] transition-colors duration-300 font-medium">
            VISIONATRIX
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-11">
          {navItems.map((item, idx) => {
            const active = isItemActive(item);
            return (
              <button
                key={idx}
                onClick={() => onNavClick(item.id)}
                className={`font-outfit text-[12.5px] tracking-[0.18em] transition-colors duration-300 cursor-pointer ${
                  active 
                    ? "text-white font-semibold" 
                    : "text-[#94a3b8] hover:text-white"
                } nav-link-underline ${active ? "active" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Get Started CTA */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => onNavClick("contact")}
              className="border border-[#c5a880] hover:border-[#e2cbb0] bg-transparent hover:bg-[#c5a880]/10 text-[#c5a880] hover:text-[#e2cbb0] font-outfit text-[11.5px] tracking-[0.2em] px-6 py-3 rounded-sm transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
            >
              <span>GET STARTED</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden flex-col items-center justify-center w-10 h-10 border border-[#c5a880]/35 rounded-sm bg-[#0b0b0e]/80 text-[#c5a880] cursor-pointer z-[10005] relative focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between items-center">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 7.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-5 h-[1.5px] bg-[#c5a880] origin-center"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-5 h-[1.5px] bg-[#c5a880] origin-center"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -7.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-5 h-[1.5px] bg-[#c5a880] origin-center"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] lg:hidden bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            {/* Background design pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[#c5a880]/3 blur-[120px] rounded-full" />
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col items-center gap-7 z-10">
              {navItems.map((item, idx) => {
                const active = isItemActive(item);
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavClick(item.id);
                    }}
                    className={`font-outfit text-base tracking-[0.22em] transition-colors duration-300 cursor-pointer ${
                      active 
                        ? "text-[#c5a880] font-semibold" 
                        : "text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}

              {/* Mobile CTA Button inside the menu drawer */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.4 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavClick("contact");
                }}
                className="mt-6 border border-[#c5a880] bg-[#c5a880]/5 hover:bg-[#c5a880]/15 text-[#c5a880] hover:text-[#e2cbb0] font-outfit text-[12px] tracking-[0.2em] px-8 py-3.5 rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>GET STARTED</span>
                <span>→</span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
