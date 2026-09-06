"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Send } from "lucide-react";
import Image from "next/image";
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live twinkling cyber pixel canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    const pixelSize = 6; // Crisp pixel cell size matching reference
    const cols = Math.floor(width / pixelSize);
    const rows = Math.floor(height / pixelSize);

    // Create clusters of digital pixel noise and scattered matrix points
    interface Pixel {
      x: number;
      y: number;
      size: number;
      opacity: number;
      targetOpacity: number;
      speed: number;
      color: string;
    }

    const pixels: Pixel[] = [];
    const colors = [
      "rgba(197, 168, 128, ", // Dark gold (#c5a880)
      "rgba(255, 255, 255, ", // Bright silver white
      "rgba(140, 140, 160, ", // Cyber gray
      "rgba(218, 180, 130, ", // Soft glowing amber gold
    ];

    // Seed 250 individual flickering pixel nodes
    for (let i = 0; i < 280; i++) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      const isLarge = Math.random() > 0.85;

      pixels.push({
        x: col * pixelSize,
        y: row * pixelSize,
        size: isLarge ? pixelSize * 2 : pixelSize,
        opacity: Math.random() * 0.4,
        targetOpacity: Math.random() * 0.5 + 0.05,
        speed: 0.003 + Math.random() * 0.01,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Seed 15 pixel cluster groups (clouds of digital blocks)
    for (let c = 0; c < 15; c++) {
      const centerCol = Math.floor(Math.random() * cols);
      const centerRow = Math.floor(Math.random() * rows);
      const clusterSize = Math.floor(Math.random() * 8) + 4;

      for (let i = 0; i < clusterSize; i++) {
        const offsetCol = centerCol + (Math.floor(Math.random() * 7) - 3);
        const offsetRow = centerRow + (Math.floor(Math.random() * 7) - 3);
        if (offsetCol >= 0 && offsetCol < cols && offsetRow >= 0 && offsetRow < rows) {
          pixels.push({
            x: offsetCol * pixelSize,
            y: offsetRow * pixelSize,
            size: pixelSize,
            opacity: Math.random() * 0.35,
            targetOpacity: Math.random() * 0.45 + 0.05,
            speed: 0.005 + Math.random() * 0.012,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background cyber grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 0.5;
      const gridSpacing = pixelSize * 3;

      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Render & animate each pixel block
      pixels.forEach((p) => {
        // Smooth pulse transition toward target opacity
        if (p.opacity < p.targetOpacity) {
          p.opacity += p.speed;
          if (p.opacity >= p.targetOpacity) {
            p.targetOpacity = Math.random() * 0.4 + 0.02;
          }
        } else {
          p.opacity -= p.speed;
          if (p.opacity <= p.targetOpacity) {
            p.targetOpacity = Math.random() * 0.4 + 0.05;
          }
        }

        const currentAlpha = Math.max(0, Math.min(0.5, p.opacity));
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fillRect(p.x, p.y, p.size - 1, p.size - 1);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.9 },
      colors: ["#c5a880", "#ffffff"]
    });

    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative w-full bg-[#030304] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 lg:px-24 text-xs font-sans text-[#77778c] overflow-hidden">
      
      {/* 1. Cyber Pixel Matrix Grid Canvas Backdrop */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60 z-0" />

      {/* 2. Giant Watermark Logo Emblem Background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[480px] h-[340px] md:h-[480px] pointer-events-none opacity-[0.05] mix-blend-screen z-0">
        <Image
          src="/LOGO.webp"
          alt="Visionatrix Emblem Watermark"
          fill
          className="object-contain filter grayscale contrast-200"
        />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 mb-16 items-start z-10">
        
        {/* Left Side: Brand Logo, Subscription & Social Links */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg md:text-xl font-bold tracking-[0.25em] text-white">
              VISIONATRIX
            </span>
            <span className="font-sans text-[10px] tracking-[0.35em] text-[#555566] uppercase">
              DESIGN. VISUALIZE. EXPERIENCE.
            </span>
          </div>

          {/* Research notes form */}
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2 max-w-sm">
            <label className="font-mono text-[9px] tracking-wider text-[#555566] uppercase">
              SECURE RESEARCH NOTES
            </label>
            
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder={subscribed ? "SUBSCRIPTION LOCKED" : "Secure Email..."}
                disabled={subscribed}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`font-sans bg-white/[0.03] border ${
                  subscribed ? "border-[#c5a880] text-[#c5a880]" : "border-white/10 focus:border-[#c5a880]"
                } rounded-lg px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none transition-all duration-300 w-full`}
              />
              <button
                type="submit"
                disabled={subscribed}
                className="absolute right-3 text-white/40 hover:text-[#c5a880] disabled:text-[#c5a880] transition-colors duration-300 w-7 h-7 flex items-center justify-center cursor-pointer"
                aria-label="Submit email"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <span className="text-[#c5a880] font-mono text-[9px] tracking-wide mt-1 animate-pulse">
                {"// Transmission secure. System registry updated."}
              </span>
            )}
          </form>

          {/* Slogan & Social Media Icons */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#c5a880]/80 uppercase">
              <span className="w-3 h-[1px] bg-[#c5a880]" />
              IDEAS TODAY. IMPACT TOMORROW.
            </div>

            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center font-outfit text-xs font-black text-white/50 hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-all duration-300 hover:scale-110"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Middle Column 1: Capabilities Menu */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            CAPABILITIES MENU
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60 pl-3">
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">Video Editing</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">VFX Simulations</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">CGI Advertising</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">Environment Creation</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">WebGL Web Code</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">App Architectures</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">AI Production Shoots</button>
            <button onClick={() => onLinkClick("services")} className="footer-link text-left">VR & Spatial XR</button>
          </div>
        </div>

        {/* Middle Column 2: Studio System */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            STUDIO SYSTEM
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60 pl-3">
            <button onClick={() => onLinkClick("studio")} className="footer-link text-left">Studio Profile</button>
            <button onClick={() => onLinkClick("process")} className="footer-link text-left">Roadmap Steps</button>
            <button onClick={() => onLinkClick("works")} className="footer-link text-left">Metrics Audits</button>
            <button onClick={() => onLinkClick("engine-stack")} className="footer-link text-left">Telemetry Stack</button>
            <button onClick={() => onLinkClick("feedback")} className="footer-link text-left">B2B Feedback</button>
          </div>
        </div>

        {/* Middle Column 3: Registries */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            REGISTRIES
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60 pl-3">
            <button onClick={() => onLinkClick("contact")} className="footer-link text-left">Direct Scoping Inbox</button>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">Studio LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-link">Studio X / Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">Shared Github</a>
          </div>
        </div>

      </div>

      {/* Footer Bottom Row */}
      <div className="relative border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0 z-10">
        {/* Copyright */}
        <span className="font-mono text-[9px] tracking-wider text-[#444455] uppercase text-center lg:text-left">
          © 2026 VISIONATRIX STUDIO CO. ALL DESIGN INTEGRITY COMPLIED.
        </span>

        {/* Live world clocks across time zones */}
        <div className="font-mono text-[9px] text-[#555566] tracking-[0.15em] uppercase flex items-center flex-wrap gap-1">
          <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>[ WORLD CLOCKS: LONDON: {worldTimes.london}{" // "}NEW YORK: {worldTimes.ny}{" // "}TOKYO: {worldTimes.tokyo}{" // "}BENGALURU: {worldTimes.blr} ]</span>
        </div>
      </div>

    </footer>
  );
}
