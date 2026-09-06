"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface FooterProps {
  onLinkClick: (sectionId: string) => void;
}

export default function Footer({ onLinkClick }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [worldTimes, setWorldTimes] = useState({
    london: "00:00:00",
    ny: "00:00:00",
    tokyo: "00:00:00",
    blr: "00:00:00"
  });

  // Live ticking clocks for global timezones across the world
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const format = (tz: string) =>
        new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).format(date);

      setWorldTimes({
        london: format("Europe/London"),
        ny: format("America/New_York"),
        tokyo: format("Asia/Tokyo"),
        blr: format("Asia/Kolkata")
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscribed(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.85 },
      colors: ["#c5a880", "#ffffff", "#38bdf8"]
    });

    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative w-full bg-[#030305] border-t border-white/10 text-xs font-sans text-[#88889a] overflow-hidden pt-12 md:pt-16 pb-8">
      
      {/* Top Header Strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#c5a880]/30 bg-[#0b0b10] flex items-center justify-center p-1">
            <Image
              src="/LOGO.webp"
              alt="Visionatrix Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="font-display text-base md:text-lg font-bold tracking-[0.2em] text-white uppercase">
            VISIONATRIX
          </span>
        </div>
        <span className="font-mono text-[9.5px] md:text-[10.5px] tracking-[0.25em] text-[#55556a] uppercase">
          Design. Visualize. Experience.
        </span>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 items-start">
        
        {/* Column 1: Agency Info & Direct Contact Details */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-sm font-bold tracking-wider text-white">
              VISIONATRIX
            </span>
          </div>

          <p className="font-sans text-xs text-[#88889a] leading-relaxed max-w-xs font-light">
            Engineering world-class 3D WebGL interfaces, autonomous n8n agentic pipelines, and high-fidelity visual fx ecosystems.
          </p>

          <div className="flex flex-col gap-2.5 mt-2 font-mono text-[11px] text-white/70">
            <a href="mailto:hello@visionatrix.studio" className="flex items-center gap-2.5 hover:text-[#c5a880] transition-colors duration-300">
              <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>hello@visionatrix.studio</span>
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-[#c5a880] transition-colors duration-300">
              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>+91 98765 43210</span>
            </a>
            <div className="flex items-center gap-2.5 text-white/60">
              <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Bengaluru // Global Operations</span>
            </div>
          </div>
        </div>

        {/* Column 2: CAPABILITIES */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-outfit text-xs tracking-[0.18em] text-[#c5a880] font-bold uppercase">
            CAPABILITIES
          </span>
          <div className="flex flex-col gap-2.5 font-outfit text-xs font-medium text-white/60">
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">Video Editing</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">VFX Simulations</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">CGI Advertising</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">Environment Creation</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">WebGL Web Code</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">App Architectures</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">VR & Spatial XR</button>
          </div>
        </div>

        {/* Column 3: STUDIO SYSTEM */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-outfit text-xs tracking-[0.18em] text-[#c5a880] font-bold uppercase">
            STUDIO
          </span>
          <div className="flex flex-col gap-2.5 font-outfit text-xs font-medium text-white/60">
            <button onClick={() => onLinkClick("studio")} className="footer-link text-left">Studio Profile</button>
            <button onClick={() => onLinkClick("process")} className="footer-link text-left">Roadmap Steps</button>
            <button onClick={() => onLinkClick("works")} className="footer-link text-left">Metrics Audits</button>
            <button onClick={() => onLinkClick("engine-stack")} className="footer-link text-left">Telemetry Stack</button>
            <button onClick={() => onLinkClick("feedback")} className="footer-link text-left">B2B Feedback</button>
          </div>
        </div>

        {/* Column 4: RESOURCES / SUPPORT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-outfit text-xs tracking-[0.18em] text-[#c5a880] font-bold uppercase">
            RESOURCES
          </span>
          <div className="flex flex-col gap-2.5 font-outfit text-xs font-medium text-white/60">
            <button onClick={() => onLinkClick("contact")} className="footer-link text-left">Direct Scoping Inbox</button>
            <button onClick={() => onLinkClick("faq")} className="footer-link text-left">Help & FAQs</button>
            <button onClick={() => onLinkClick("studio")} className="footer-link text-left">Privacy Policy</button>
            <button onClick={() => onLinkClick("studio")} className="footer-link text-left">Terms of Service</button>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold uppercase mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              System Status: Active
            </span>
          </div>
        </div>

        {/* Column 5: NEWSLETTER SUBSCRIPTION CARD */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <span className="font-outfit text-xs tracking-[0.18em] text-[#c5a880] font-bold uppercase">
            NEWSLETTER
          </span>
          <p className="font-sans text-xs text-[#88889a] leading-relaxed font-light">
            Subscribe to receive telemetry updates, technical research notes & exclusive agency insights.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 mt-1">
            <div className="relative flex items-center bg-[#09090d] border border-white/10 rounded-xl p-1 focus-within:border-[#c5a880]/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <input
                type="email"
                placeholder={subscribed ? "TRANSMISSION LOCKED" : "Enter your email..."}
                disabled={subscribed}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`font-sans bg-transparent px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none w-full ${
                  subscribed ? "text-[#c5a880]" : ""
                }`}
              />
              <button
                type="submit"
                disabled={subscribed}
                className="w-9 h-9 rounded-lg bg-[#c5a880] hover:bg-[#e2cbb0] disabled:bg-[#c5a880]/50 text-[#09090d] font-bold flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(197,168,128,0.3)]"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {subscribed && (
              <span className="text-[#c5a880] font-mono text-[9.5px] tracking-wider animate-pulse">
                {"// Transmission secure. System registry updated."}
              </span>
            )}
          </form>
        </div>

      </div>

      {/* LOWER BACKGROUND ARTWORK: Pixel Cyber Matrix Landscape & Logo Watermark */}
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] my-6 overflow-hidden flex items-end justify-center pointer-events-none select-none">
        
        {/* Pixel Grid Cyber Landscape Artwork Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/visionatrix_pixel_footer_bg.png"
            alt="Visionatrix Cyber Pixel Background Landscape"
            fill
            className="object-cover object-bottom opacity-40 mix-blend-screen filter contrast-125"
          />
        </div>

        {/* Top & Bottom Gradient Fades for Seamless Dark Integration */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#030305] via-[#030305]/80 to-transparent z-1" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#030305] via-[#030305]/90 to-transparent z-1" />

        {/* Large Semi-Transparent Pixel Agency Watermark Title */}
        <div className="absolute inset-0 z-2 flex items-center justify-center">
          <span className="font-display text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.25em] text-[#c5a880]/[0.06] uppercase text-center whitespace-nowrap">
            VISIONATRIX
          </span>
        </div>

        {/* Floating Social Media Icon Pills Overlay */}
        <div className="relative z-10 mb-8 pointer-events-auto flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#0b0b10]/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#c5a880] hover:border-[#c5a880]/50 hover:bg-[#c5a880]/10 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#0b0b10]/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#c5a880] hover:border-[#c5a880]/50 hover:bg-[#c5a880]/10 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#0b0b10]/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#c5a880] hover:border-[#c5a880]/50 hover:bg-[#c5a880]/10 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            aria-label="X Twitter"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#0b0b10]/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#c5a880] hover:border-[#c5a880]/50 hover:bg-[#c5a880]/10 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Legal Bar & Live World Clocks */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#55556a]">
        <div className="flex items-center gap-2 text-center lg:text-left">
          <span>© 2026 Visionatrix Studio Co. by Yuvraj Rathod & Team. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 tracking-wider uppercase text-[#66667e]">
            <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>[ LONDON: {worldTimes.london}{" // "}NY: {worldTimes.ny}{" // "}TOKYO: {worldTimes.tokyo}{" // "}BLR: {worldTimes.blr} ]</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.02] text-white/50 text-[9px]">
            v1.0.0 Stable
          </span>
        </div>
      </div>

    </footer>
  );
}
