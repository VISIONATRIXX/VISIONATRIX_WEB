"use client";

import { useState, useEffect } from "react";
import { Clock, Send } from "lucide-react";
import confetti from "canvas-confetti";

interface FooterProps {
  onLinkClick: (sectionId: string) => void;
}

export default function Footer({ onLinkClick }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");

  // Live ticking clocks for India Standard Time (IST)
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setTimeStr(formatter.format(date));
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
    <footer className="w-full bg-[#030304] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 lg:px-24 text-xs font-sans text-[#77778c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 mb-16 items-start">
        
        {/* Left Side: Brand Logo and Subscription */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg font-bold tracking-[0.25em] text-white">
              VISIONATRIX
            </span>
            <span className="font-sans text-[10px] tracking-[0.35em] text-[#555566] uppercase">
              DESIGN. VISUALIZE. EXPERIENCE.
            </span>
          </div>

          {/* Research notes form */}
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-4 max-w-sm">
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
                className={`font-sans bg-white/2 border ${
                  subscribed ? "border-[#c5a880] text-[#c5a880]" : "border-white/10 focus:border-[#c5a880]"
                } rounded px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none transition-all duration-300 w-full`}
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
                // Transmission secure. System registry updated.
              </span>
            )}
          </form>
        </div>

        {/* Middle Column 1: Capabilities Menu */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            CAPABILITIES MENU
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60">
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Video Editing</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">VFX Simulations</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">CGI Advertising</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Environment Creation</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">WebGL Web Code</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">App Architectures</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">AI Production Shoots</button>
            <button onClick={() => onLinkClick("services")} className="text-left hover:text-[#c5a880] transition-colors duration-300">VR & Spatial XR</button>
          </div>
        </div>

        {/* Middle Column 2: Studio System */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            STUDIO SYSTEM
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60">
            <button onClick={() => onLinkClick("studio")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Studio Profile</button>
            <button onClick={() => onLinkClick("process")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Roadmap Steps</button>
            <button onClick={() => onLinkClick("works")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Metrics Audits</button>
            <button onClick={() => onLinkClick("engine-stack")} className="text-left hover:text-[#c5a880] transition-colors duration-300">Telemetry Stack</button>
            <button onClick={() => onLinkClick("feedback")} className="text-left hover:text-[#c5a880] transition-colors duration-300">B2B Feedback</button>
          </div>
        </div>

        {/* Middle Column 3: Registries */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-outfit text-[10px] tracking-widest text-[#c5a880] font-bold uppercase">
            REGISTRIES
          </span>
          <div className="grid grid-cols-1 gap-2.5 font-outfit font-medium text-white/60">
            <a href="#contact" className="hover:text-[#c5a880] transition-colors duration-300">Direct Scoping Inbox</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a880] transition-colors duration-300">Studio LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a880] transition-colors duration-300">Studio X / Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a880] transition-colors duration-300">Shared Github</a>
          </div>
        </div>

      </div>

      {/* Footer Bottom Row */}
      <div className="border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
        {/* Copyright */}
        <span className="font-mono text-[9px] tracking-wider text-[#444455] uppercase text-center lg:text-left">
          © 2026 VISIONATRIX STUDIO CO. ALL DESIGN INTEGRITY COMPLIED.
        </span>

        {/* Live IST clock inside brackets */}
        <div className="font-mono text-[9px] text-[#555566] tracking-[0.15em] uppercase flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>[ CLOCKS: BENGALURU: {timeStr || "00:00:00"} // MUMBAI: {timeStr || "00:00:00"} // DELHI: {timeStr || "00:00:00"} ]</span>
        </div>
      </div>

    </footer>
  );
}
